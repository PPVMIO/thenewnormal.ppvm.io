output "invoke_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}