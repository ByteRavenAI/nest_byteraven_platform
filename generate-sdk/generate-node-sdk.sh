#!/bin/bash
# bash generate-sdk.sh

# Generate the SDK using custom templates
openapi-generator-cli generate -i http://localhost:3000/api-json -o C:/Users/admin/Documents/ByteRaven_Docs/screening_ai_node/src -g typescript-fetch --additional-properties=supportsES6=true,npmVersion=6.9.0,typescriptThreePlus=true
