import requests
import json
from dateutil.parser import *
import csv
from datetime import datetime
import io

NUM_COLUMNS = 6

def check_empty_string(s):
  return 0 if not s else int(s)
  # if s:
  #   return int(s)
  # else:
  #   0

def handler(event, context):
  fieldname = ['NEW_COVID_CASE_COUNT', 'HOSPITALIZED_CASE_COUNT', 'DEATH_COUNT']
  hosp_data_resp = requests.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/case-hosp-death.csv').content
  hosp_data_csv = csv.DictReader(io.StringIO(hosp_data_resp.decode('utf8')))

  datapoints_new_cases_daily = {'id': 'cases_daily', 'data': []}
  datapoints_hospitalized_daily = {'id': 'hospital_daily', 'data': []}
  datapoints_death_count_daily = {'id': 'deaths_daily', 'data': []}

  datapoints_new_cases_totals = {'id': 'cases_total', 'data': []}
  datapoints_hospitalized_totals = {'id': 'hospital_totals', 'data': []}
  datapoints_death_count_totals = {'id': 'deaths_total', 'data': []}

  cases_total = 0
  hospitalizations_total = 0
  deaths_total = 0

  for row in hosp_data_csv:
    # for col_name, value in row.items():
    print(row)
    date = row['DATE_OF_INTEREST']

    new_cases_daily = row['CASE_COUNT']
    hospitalized_daily = row['HOSPITALIZED_COUNT']
    death_count_daily = row['DEATH_COUNT']

    cases_total = check_empty_string(new_cases_daily) + cases_total
    hospitalizations_total = check_empty_string(hospitalized_daily) + hospitalizations_total
    deaths_total = check_empty_string(death_count_daily) + deaths_total

    datapoint_new_cases_daily = {
      'x': date,
      'y': new_cases_daily,
    }
    datapoint_hospitalized_daily = {
      'x': date,
      'y': hospitalized_daily,
    }
    datapoint_death_count_daily = {
      'x': date,
      'y': death_count_daily,
    }

    datapoint_new_cases_totals = {
      'x': date,
      'y': cases_total,
    }
    datapoint_hospitalized_totals = {
      'x': date,
      'y': hospitalizations_total,
    }
    datapoint_death_count_totals = {
      'x': date,
      'y': deaths_total,
    }

    if new_cases_daily:
      datapoints_new_cases_daily['data'].append(datapoint_new_cases_daily)
    if hospitalized_daily:
      datapoints_hospitalized_daily['data'].append(datapoint_hospitalized_daily)
    if death_count_daily:
      datapoints_death_count_daily['data'].append(datapoint_death_count_daily)

    if int(cases_total) != 0:
      datapoints_new_cases_totals['data'].append(datapoint_new_cases_totals)
    if int(hospitalizations_total) != 0:
      datapoints_hospitalized_totals['data'].append(datapoint_hospitalized_totals)
    if int(deaths_total) != 0:
      datapoints_death_count_totals['data'].append(datapoint_death_count_totals)

  body = [
    datapoints_new_cases_daily, 
    # datapoints_hospitalized_daily, 
    datapoints_death_count_daily,
    datapoints_new_cases_totals,
    # datapoints_hospitalized_totals,
    datapoints_death_count_totals
  ]

  response = {
    'headers': {
      'Access-Control-Allow-Origin': '*'
    },
    'statusCode': 200,
    'body': json.dumps(body)
  }
  return response