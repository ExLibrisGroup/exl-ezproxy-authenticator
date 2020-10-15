# EZproxy Authenticator for Alma
This project allows [EZproxy](https://www.oclc.org/en/ezproxy.html) to authenticate users stored in the [Ex Libris Identity Service](https://knowledge.exlibrisgroup.com/Alma/Product_Documentation/010Alma_Online_Help_(English)/090Integrations_with_External_Systems/060Authentication/Ex_Libris_Identity_Service) via EZproxy [external script authentication](https://help.oclc.org/Library_Management/EZproxy/Authenticate_users/EZproxy_authentication_methods/External_script_authentication). 

## Configuring EZproxy Groups
The authenticator can be configured to return an EZproxy group based on the user's group. The configuration takes the form of a "JSON" object such as the below:
```
{ 
  "Staff": ["ST"],
  "Graduate Students": ["GR", "DC"],
  "Everyone": ["*"]
}
```

You can use the value `*` as a catch-all if you want a default group.

The value should then be compacted and added in the `EZPROXY_GROUP_MAPPING` environment variable. The compact view removes new lines and spaces:
```
{"Staff":["ST"],"Graduate Students":["GR", "DC"],"Everyone": ["*"]}
```

In addition, an Alma API key with read/write access for users is required and should be in the `ALMA_APIKEY` environment variable.

## Deploying and Configuring the Authenticator
The easiest way to use this authenticator is to use Amazon Web Services (AWS). AWS has starter and free tiers which make hosting the authenticator nearly free. To deploy to AWS, log into your account (or create a new one). Then follow the instructions below.

1. Click on [this link](https://console.aws.amazon.com/cloudformation/home?#/stacks/create/review?templateURL=https://almadtest.s3.amazonaws.com/sam/exl-ezproxy-authenticator/cloudformation.packaged.yaml&stackName=ExlEZproxyAuthenticator) to open the AWS console.
1. Fill in the specified parameters and check off the boxes in the *Capabilities and transforms* section and then click the *Create stack* button
1. AWS will create the necessary components. When it's complete, the stack will be in the *CREATE_COMPLETE* state. Click the *Outputs* tab to view the URL for the connector. You will use the URL to configure Primo in the following section.

## Configuring EZproxy
Follow the intructions in the [EZproxy documentation](https://help.oclc.org/Library_Management/EZproxy/Authenticate_users/EZproxy_authentication_methods/External_script_authentication) to add this line to the *user.txt* file:
```
::external=https://********.execute-api.us-east-1.amazonaws.com/,post=user=^u&pass=^p
```