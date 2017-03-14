# cfnjs

CloudFormation helper.

## INSTALL

```
npm install -g cfnjs
```

## USAGE

cfn.json

```
{
  "region": "us-east-1",
  "templatePath": "./path/to/template.json",
  "stackName": "YOUR_STACK_NAME",
  "s3": {
    "bucket": "YOUR_BUCKET_NAME",
    "key": "path/to/template.json"
  }
}
```

```
cfnjs validate
```

```
cfnjs upload
```
