import { ConfidentialClientApplication, PublicClientApplication } from '@azure/msal-node';
import { log } from 'console';
import fetch from 'node-fetch';
import { CustomMessages } from 'src/utils/custom-messages';
import { Response } from 'src/utils/response';
import { StatusCodes } from 'src/utils/status-codes';
const jwt = require('jsonwebtoken');

export class AzureAdService {

  static async getAccessToken() {
    try {
      const msalConfig = {
        auth: {
          clientId: process.env.CLIENT_ID,
          authority: `https://login.microsoftonline.com/${process.env.TOKEN_ID}`,
          clientSecret: process.env.CLIENT_SECRET
        }
      };
      const msalClient = new ConfidentialClientApplication(msalConfig);
      const tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default']
      };      
      const response = await msalClient.acquireTokenByClientCredential(tokenRequest);
      console.log("-=-=-=1111response",response);
      return response.accessToken;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userObj) {
    try {
      const accessToken = await this.getAccessToken();
      console.log("accessToken", accessToken)
      const apiUrl = 'https://graph.microsoft.com/v1.0/users';
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountEnabled: true,
          displayName: userObj['first_name'] + " " + userObj['last_name'],
          mailNickname: userObj['first_name'],
          userPrincipalName: userObj['email'],
          passwordProfile: {
            forceChangePasswordNextSignIn: false,
            password: userObj['password']
          }
        })
      };

      const azureResponse = await fetch(apiUrl, requestOptions);
      let responseObj = await azureResponse.json();
      console.log("responseObj", responseObj);

      if (responseObj['id']) {
        let userObj = {};
        userObj['ad_user_id'] = responseObj['id'];
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, userObj);
      } else {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.BAD_REQUEST, {});
      }
    } catch (error) {
      return new Response(false, StatusCodes.INTERNAL_SERVER_ERROR, CustomMessages.INTERNAL_SERVER_ERROR, {});
    }
  }

  static async getUserIdFromToken(token) {
    const decodedToken = jwt.decode(token);
    let userId = decodedToken['oid']
    return "70fe5ceb-a6d9-4500-9d3d-0c51f4b80a30";
  }

  static async getUserInfo(userId: string) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  static async resetUserPassword(azure_user_id, old_password, new_password) {

    const msalConfig = {
      auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TOKEN_ID}`,
        clientSecret: process.env.CLIENT_SECRET
      }
    };
    const msalClient = new ConfidentialClientApplication(msalConfig);
    const userInfo = await this.getUserInfo(azure_user_id);
    const tokenRequest = {
      scopes: ['openid', 'profile', 'user.read'],
      username: userInfo['userPrincipalName'],
      password: old_password
    };
    let userPwdCheckResponse = await msalClient.acquireTokenByUsernamePassword(tokenRequest);
    // console.log("userPwdCheckResponse",userPwdCheckResponse);
    const accessToken = await this.getAccessToken();
    console.log("accessToken",accessToken);
    const apiUrl = `https://graph.microsoft.com/v1.0/users/${azure_user_id}`;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // accountEnabled: true,
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: new_password
        }
      })
    };
    const azureResponse = await fetch(apiUrl, requestOptions);
    let responseObj = await azureResponse.json();
    console.log("responseObj", responseObj);
  }
}