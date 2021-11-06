
#include <WiFi.h>
#include <HTTPClient.h>
#include "utilidad.h"
#include "Json_data.hpp"

const char* ssid = "FUGANET";
const char* password = "04Jd10MeFG";
String comandos;

WiFiClient client;
HTTPClient http;

void setup() {
  
  Serial.begin(DEBUGER);
  SerialMon.begin(MON_BAUD_RATE, SERIAL_8N1, MON_RX_PIN, MON_TX_PIN); //Baud rate, parity mode, RX, TX
  Serial.setTimeout(30);
  SerialMon.setTimeout(30); 

  Serial.print("Timeout: ");
  Serial.println(Serial.getTimeout());
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

}

void loop() {

recibe_json();

}

void sendPOST(const char* serverName, String httpRequestData){
  
    if(WiFi.status()== WL_CONNECTED){
      
      http.begin(client, serverName);

      http.addHeader("Content-Type", "application/json");
      
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);

      if (httpResponseCode > 0) { //Check for the returning code
 
        String payload = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(payload);
 
      }else {
 
      Serial.println("Error on HTTP request");
 
      }
        
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
 }

bool httpPOST(const char server[], const char resource[], int port, String httpRequestData)
{

  DynamicJsonDocument data_doc(1024);

  bool check = false;

  Serial.print("[]POST send - Connecting ");
  Serial.print(server);

  if (!client.connect(server, port))
  {
    Serial.println(" fail");
  }
  else
  {

    Serial.println(" OK");

    // Making an HTTP POST request
    Serial.println("Performing HTTP POST request...");

    client.print(String("POST ") + resource + " HTTP/1.1\r\n");
    client.print(String("Host: ") + server + "\r\n");
    client.println("Connection: close");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(httpRequestData.length());
    client.println();
    client.println(httpRequestData);

    Serial.print("Envia POST: ");
    Serial.println(httpRequestData);

    unsigned long timeout = millis();
    while (client.connected() && millis() - timeout < 3000)
    {
      if (client.available())
      {
        while (client.available())
        {

          String chat = client.readString();

          comandos = "Msg:/" + chat + "&";
        }

        //SerialMon.println(comandos);

        if (comandos.indexOf("Msg:/") >= 0)
        {

          int pos1 = comandos.indexOf('{');
          int pos2 = comandos.indexOf('&');
          String JSON_post = comandos.substring(pos1, pos2);

          JSON_post.trim();
          
          Serial.print("Recibe Json: ");
          Serial.println(JSON_post);

          DeserializationError error = deserializeJson(data_doc, JSON_post);
          if (error)
          {
            JSON_post = "";
          }
          else
          {

            Serial.println();
            serializeJsonPretty(data_doc, Serial);
            Serial.println();
            
           }

           check = true;
         }
         
          comandos = "";
          Serial.flush();
        }
      }
    }

    client.stop();
    Serial.println(F("Server disconnected"));
    return check;
  }
