![squared up logo](squaredUp.png "Squared Up Logo")

# Fizzgig

Single page react web app that uses redis, mongodb and the Alpha-Vantage stock API via AWS Lambda.

A React UI enables login and the management of user specific config that determines the contents
of the Fizzgig stock ticker visualisation dashboard.

A scheduled lambda function is used to poll the Alpha-Vantage API and push 'subscribed' tickers
to AWS's elasticache managed Redis service. All instances of the app poll the cache proxied through lambda function.  
The scheduled lambda also looks at the users ticker thresholds, set in the UI.  
The scheduler will send the user an email if a user created price threshold is crossed.

Setting up in AWS is fairly involved and too complicated to explain in detail here. You will need to set up
instances of MongoDb as well as the AWS services Elasticache Redis, Lambda and SES.  
You will need to set up a CDN that is linked to a security group shared by these AWS services.  
You will need to set up scheduling rules for cloud watch events for the scheduling function, I run it ever minute with **rate(1 minute)**  
You will also need to make sure that lambda has the following execution roles:

    "logs:CreateLogGroup"
    "logs:CreateLogStream"
    "logs:PutLogEvents"
    "ec2:CreateNetworkInterface"
    "ec2:DescribeNetworkInterfaces"
    "ec2:DeleteNetworkInterface"
    "ses:SendEmail",
    "ses:SendRawEmail"

## Installing the Serverless API

**Install Serverless:**  
https://serverless.com/framework/docs/getting-started/

**Install dependencies** (inside ./serverless - _npm install_)
<br><br>

## Installing the Create React App UI

**Install dependencies** (inside /client - _yarn install_)

Before execution setup .env's in both folders copying the.example-env layouts and populate with your ports
and secrets etc as described in the files.

The serverless repo has a secrets.json (example.secrets.json) as well as .test-env (.example.test-env)
in the /etc folder. These variables are for testing locally. You can source the .env with - **source ./etc/.test-env**
<br>

**Build and deploy to AWS** - _serverless deploy_  
**Build and start the UI** - _yarn start_

### Other API Commands

- **Invoke Serverless locally** - _serverless invoke local --function functionName_
- **Start Serverless offline** - _npm run offline_
- **Serverless terminal logs tail** - serverless logs -f functionName --tail
- **Build and run tests and Istanbul coverage** - _npm run test_
- **Build and run one test** - _npm run test-one_
