import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "./dynamodb.mjs";
import { TABLE_NAME, ID } from "./constants.mjs";
import { response } from "./utils.mjs";

export const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const ml = params?.ml ? parseInt(params.ml, 10) : null;

    if (!ml) {
      const result = await dynamo.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: ID },
        }),
      );

      return response(200, {
        totalMl: result.Item?.totalMl ?? 0,
      });
    }

    if (ml <= 0 || isNaN(ml)) {
      return response(400, { message: "Invalid ml value" });
    }

    const result = await dynamo.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: ID },
        UpdateExpression: "SET totalMl = if_not_exists(totalMl, :zero) + :ml",
        ExpressionAttributeValues: {
          ":ml": ml,
          ":zero": 0,
        },
        ReturnValues: "UPDATED_NEW",
      }),
    );

    return response(204, {
      totalMl: result.Attributes.totalMl,
    });
  } catch (error) {
    console.error(error);
    return response(500, { message: "Internal Server Error" });
  }
};
