#include <ArduinoJson.h>

/*
ARDUINOJSON_DECODE_UNICODE Permite emplear caracteres unicode (\uXXXX)
ARDUINOJSON_DEFAULT_NESTING_LIMIT: Define el límite de anidado
ARDUINOJSON_ENABLE_NAN Emplear 'NaN' o 'null'
ARDUINOJSON_ENABLE_INFINITY Emplear 'Infinity' o 'null'
ARDUINOJSON_NEGATIVE_EXPONENTIATION_THRESHOLD Usar notación científica para números pequeños
ARDUINOJSON_POSITIVE_EXPONENTIATION_THRESHOLD Usar notación científica para números grandes1
ARDUINOJSON_USE_LONG_LONG Emplar 'long' o 'long long' para números enteros
ARDUINOJSON_USE_DOUBLE Emplear 'float' o 'double' para números en coma flotante
*/

void print_json();

long time_json;
String comandos_json;
String JSON;

void recibe_json(void)
{
  if (Serial.available())
  {
    while (Serial.available())
    {
      String chat = Serial.readString();
      comandos_json = "Msg:/" + chat + "&";
    }
    if (comandos_json.indexOf("Msg:/") >= 0)
    {
      int pos1 = comandos_json.indexOf('{');
      int pos2 = comandos_json.indexOf('&');
      JSON = comandos_json.substring(pos1, pos2);

      JSON.trim();
      Serial.println(JSON);
      print_json();
      Serial.flush();
    }
  }
}

void envia_json(void)
{

  DynamicJsonDocument doc_envia(1024);
  //{"Power":1,"Pwm":1023,"Conteo0":[0,8888],"PosI0":[0,0],"PosD0":[11,11],"Clr":0,"Conteo1":[0,8888],"PosI1":[0,0],"PosD1":[11,11],"Fechas":[1,2,2035,3,5,2026],"Data":[99,42,33,44]}

  if (millis() > time_json + TIME_JSON)
  {

    serializeJson(doc_envia, SerialMon);
    SerialMon.println();

    time_json = millis();
  }
}

void print_json()
{
  Serial.println("paquete Json: ");
  Serial.println(JSON);
  DynamicJsonDocument doc_recibe(1023);
  DeserializationError error = deserializeJson(doc_recibe, JSON);
  if (error)
  {
    JSON = "";
    return;
  }
  else
  {
    Serial.println("paquete: ");
    sendPOST(serverName,JSON);
    //httpPOST(server,resource, port, JSON);
  }
}
