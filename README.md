![squared up logo](squaredUp.png "Squared Up Logo")

# Fizzgig

Single page react web app that uses redis, mongodb and the Alpha-Vantage stock API via AWS Lambda.
A React UI enables login and the management of user specific config that determines the contents
of the Fizzgig stock ticker visualisation dashboard.

A scheduled lambda function is used to poll the alpha vantage API and push 'subscribed' tickers
to AWS's elasticache managed Redis service. All instances of the app poll the cache via a lambda function.
The scheduled lambda also looks at the users ticker thresholds, set in the UI.
The scheduler will send the user an email if a user created price threshold is crossed.
