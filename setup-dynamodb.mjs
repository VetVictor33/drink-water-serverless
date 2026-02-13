import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "sa-east-1",
  endpoint: "http://dynamodb:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const params = {
  TableName: "DrinkTracker",
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  BillingMode: "PAY_PER_REQUEST",
};

try {
  await client.send(new CreateTableCommand(params));
  console.log("Table created successfully");
} catch (error) {
  if (error.name === "ResourceInUseException") {
    console.log("Table already exists");
  } else {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}
