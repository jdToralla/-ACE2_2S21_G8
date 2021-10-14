// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

// REQUIRES the following Arduino libraries:
// - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor


#include "I2Cdev.h"
#include "MPU6050.h"
#include "Wire.h"

#include "DHT.h"
#define sensor_DO A1
#define DHTPIN 26     // Digital pin connected to the DHT sensor
// Feather HUZZAH ESP8266 note: use pins 3, 4, 5, 12, 13 or 14 --
// Pin 15 can work but DHT must be disconnected during program upload.

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
MPU6050 sensormp;
// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 3 (on the right) of the sensor to GROUND (if your sensor has 3 pins)
// Connect pin 4 (on the right) of the sensor to GROUND and leave the pin 3 EMPTY (if your sensor has 4 pins)
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

// Initialize DHT sensor.
// Note that older versions of this library took an optional third parameter to
// tweak the timings for faster processors.  This parameter is no longer needed
// as the current DHT reading algorithm adjusts itself to work on fasterb¿ procs.
DHT dht(DHTPIN, DHTTYPE);

int sensor = 22;
int Valor_cny70 = 0;
int Led = 3;
int repetir = 0;
String vviento = "";
int blancos = 1;
int negros = 1;
int esblanco=0;
int haylluvia=0;
int ax, ay, az;


void setup() {
  Serial.begin(9600);
  //Serial.println(F("DHTxx test!"));
  pinMode(sensor, INPUT);//Definir el sensor(pin2) como entrada
  Wire.begin();           //Iniciando I2C  
  sensormp.initialize();    //Iniciando el sensor
  dht.begin();
}

void loop() {
  // Wait a few seconds between measurements.
  if (repetir == 6000) {
    if(blancos<20)
    {
      vviento="Normal";  
    }
    else{
      vviento="Alta";  
    }
    repetir = 0;
   
    delay(10);
    int val = analogRead(sensor_DO);
    //Serial.print("Analog Output: ");
    //Serial.print(val);
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();
    // Read temperature as Fahrenheit (isFahrenheit = true)
    float f = dht.readTemperature(true);

    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t) || isnan(f)) {
      //Serial.println(F("Failed to read from DHT sensor!"));
      return;
    }

    // Compute heat index in Fahrenheit (the default)
    float hif = dht.computeHeatIndex(f, h);
    // Compute heat index in Celsius (isFahreheit = false)
    float hic = dht.computeHeatIndex(t, h, false);

    //Serial.print(F(", Humidity: "));
    //Serial.print(h);
    //Serial.print(F("%  Temperature: "));
    //Serial.print(t);
    //Serial.print(F("°C "));
    //Serial.print(f);
    //Serial.print(F("°F  Heat index: "));
    //Serial.print(hic);
    //Serial.print(F("°C "));
    //Serial.print(hif);
    //Serial.print(F("°F"));

    Valor_cny70 = digitalRead(sensor); //Leer y almacenar el valor del sensor
    // delay(100);//Esperar 100 ms

    if(val<800){
      haylluvia=1;  
    }

    sensormp.getAcceleration(&ax, &ay, &az);
  //Calcular los angulos de inclinacion:
  float accel_ang_x=atan(ax/sqrt(pow(ay,2) + pow(az,2)))*(180.0/3.14);
  float accel_ang_y=atan(ay/sqrt(pow(ax,2) + pow(az,2)))*(180.0/3.14);
  String angx = "";
  angx.concat(accel_ang_x);
    
    Serial.println(getJSON(vviento,angx,100,h,t,haylluvia));
    
    
    //Serial.print(", Velocidad del viento: ");//Imprimir en el monitor serial "linea blanca"
    //Serial.println(vviento);//Imprimir en el monitor serial "linea blanca"
    //digitalWrite(Led, LOW);//Apagar el led
     blancos = 1;
     negros = 1;

  }
  else {
    repetir = repetir + 1;
    delay(10);
    Valor_cny70 = digitalRead(sensor); //Leer y almacenar el valor del sensor
    // delay(100);//Esperar 100 ms
    //Serial.print(Valor_cny70);
    if (Valor_cny70 == 0) //si el valor es cero
    {
      negros = negros + 1;
      esblanco=0;
      //Serial.print(", Linea negra\n");//Imprimir en el monitor serial "linea negra"
      //digitalWrite(Led, HIGH);//Encender el Led
    }
    else//Si el valor del sensro es 1
    {
      if(esblanco==0){
        blancos = blancos + 1;
      }
      esblanco=1;
      //Serial.print(", Linea blanca\n");//Imprimir en el monitor serial "linea blanca"
      //digitalWrite(Led, LOW);//Apagar el led
    }
  }
}

String getJSON(String vviento, String dviento, float intensidad, float humedad, float temperatura, int lluvia){
  String svviento = "\"vviento\": " ;
  svviento = svviento + "\"" + vviento + "\"";  
  String sdviento= "\"dviento\": " ;
  sdviento = sdviento + "\"" + dviento + "\"";  
  String sintensidad = "\"intensidad\": ";
  sintensidad.concat(intensidad);
  String shumendad = "\"humedad\": " ;
  shumendad.concat(humedad);
  String stemperatura= "\"temperatura\": " ;
  stemperatura.concat(temperatura);
  String slluvia = "\"lluvia\": ";
  slluvia.concat(lluvia);
  return "{" + svviento + "," + sdviento + "," + sintensidad + "," + shumendad + "," + stemperatura + "," + slluvia + "}"; 
  }
