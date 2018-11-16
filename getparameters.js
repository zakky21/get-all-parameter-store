const AWS = require('aws-sdk')
const argv = require('argv')
argv.option([
  {
    name: 'region',
    short: 'r',
    type: 'string',
    description: 'Set target AWS region. If not set then use process.env value.'
  },
  {
    name: 'accessKeyId',
    short: 'a',
    type: 'string',
    description: 'Set target AWS accessKeyId. If not set then use process.env value.'
  },
  {
    name: 'secretAccessKey',
    short: 's',
    type: 'string',
    description: 'Set target AWS secretAccessKey. If not set then use process.env value.'
  }
])

console.log('arg', process.argv)
const env = argv.run().options
if (!env.accessKeyId) env.accessKeyId = process.env.AWS_ACCESS_KEY_ID
if (!env.secretAccessKey) env.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
if (!env.region) env.region = process.env.AWS_DEFAULT_REGION

const ssm = new AWS.SSM(env)

async function call(token) {
  const param = {
    Path: '/',
    Recursive: true
  }
  if (token) param.NextToken = token

  ssm.getParametersByPath(param, (err, data) => {
    if (err) console.log('error-occurd', err)
    else {
      for (let vv of data.Parameters) {
        console.log(vv.Name, vv.Value)
      }
      if (data.NextToken) {
        call(data.NextToken)
      }
    }
  })
}

call()
