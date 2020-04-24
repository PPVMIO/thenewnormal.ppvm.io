provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

provider "null" {
  version = "~> 2.1"
}

variable "site_name" { default = "thenewnormal.ppvm.io"}

resource "aws_s3_bucket" "website_bucket" {
  bucket = var.site_name
  acl    = "public-read"
  policy = file("policy.json")
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_api_gateway_rest_api" "api" {
  name = "newnormalapi"
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "data"
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.scrape_lambda.invoke_arn
}


resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.integration]
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = "prod"
}


resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
  EOF
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowMyDemoAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scrape_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "scrape_lambda" {
  filename      = "lambda/dist/lambda.zip"
  function_name = "scrape_lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "main.handler"
  source_code_hash = filemd5("lambda/dist/lambda.zip")
  runtime = "python3.7"
  timeout = 5
}

data "aws_s3_bucket" "thenewnormal_bucket" {
  bucket = aws_s3_bucket.website_bucket.bucket
}


data "aws_route53_zone" "ppvmio_zone" {
  name = "ppvm.io."
  private_zone = false
}

resource "aws_route53_record" "alias_record" {
  zone_id = data.aws_route53_zone.ppvmio_zone.id
  name    = "thenewnormal"
  type    = "A"

  alias {
    name    = replace(aws_cloudfront_distribution.s3_distribution.domain_name, "/[.]$/", "")
    zone_id = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_cloudfront_distribution.s3_distribution]

}

resource "aws_route53_record" "cert_validation_record" {
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.ppvmio_zone.id
  records = [aws_acm_certificate.cert.domain_validation_options.0.resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "thenewnormal.ppvm.io"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation_record.fqdn]
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled = true
  default_root_object = "index.html"
  aliases = ["thenewnormal.ppvm.io"]

  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_domain_name
    origin_id   = aws_cloudfront_origin_access_identity.access_identity.comment
  }


  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.access_identity.comment
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }



  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method = "sni-only"
  }

  depends_on = [aws_acm_certificate.cert]
}

resource "aws_cloudfront_origin_access_identity" "access_identity" {
  comment = "oai"
}

resource "null_resource" "build" {
  provisioner "local-exec" {
    command = "cd web && npm i && npm run build"
  }

  depends_on = [aws_s3_bucket.website_bucket]
}

resource "null_resource" "deploy" {
  provisioner "local-exec" {
    command = "aws s3 sync web/build/ s3://${aws_s3_bucket.website_bucket.bucket}"
  }

  depends_on = [null_resource.build]
}

resource "null_resource" "reset_cache" {
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.s3_distribution.id} --paths '/*'"
  }

  depends_on = [null_resource.deploy, aws_cloudfront_distribution.s3_distribution]
}

