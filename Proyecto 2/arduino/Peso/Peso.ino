/*
   -------------------------------------------------------------------------------------
   HX711_ADC
   Arduino library for HX711 24-Bit Analog-to-Digital Converter for Weight Scales
   Olav Kallhovd sept2017
   -------------------------------------------------------------------------------------
*/

/*
   This example file shows how to calibrate the load cell and optionally store the calibration
   value in EEPROM, and also how to change the value manually.
   The result value can then later be included in your project sketch or fetched from EEPROM.

   To implement calibration in your project sketch the simplified procedure is as follow:
       LoadCell.tare();
       //place known mass
       LoadCell.refreshDataSet();
       float newCalibrationValue = LoadCell.getNewCalibration(known_mass);
*/

#include <HX711_ADC.h>
#if defined(ESP8266)|| defined(ESP32) || defined(AVR)
#include <EEPROM.h>
#endif

//pins:
const int HX711_dout = 4; //mcu > HX711 dout pin
const int HX711_sck = 5; //mcu > HX711 sck pin

const int trigPin = 9;
const int echoPin = 10;
const int pinBuzzer = 11;
const int trigPin2 = 12;
const int echoPin2 = 13;

float duration, distance;
float duration2, distance2;
float peso;
float pesoInicial = 2;

int sentado=0;
int sentadopast = 0;
int lecturasentado = 0;
int pesoenviado=0;
int alarmatiempo=0;
int alarmaposicion=0;

int tiemposentado=0;

//HX711 constructor:
HX711_ADC LoadCell(HX711_dout, HX711_sck);

const int calVal_eepromAdress = 0;
unsigned long t = 0;

void setup() {
  Serial.begin(9600); delay(10);
  //Serial.println();
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);
  //Serial.println("Starting...");

  LoadCell.begin();
  unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true; //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag() || LoadCell.getSignalTimeoutFlag()) {
    //Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1);
  }
  else {
    LoadCell.setCalFactor(20047.50); // user set calibration value (float), initial value 1.0 may be used for this sketch 20047.50
    //Serial.println("Startup is complete");
  }
  //while (!LoadCell.update());
   tone(pinBuzzer, 523, 500);
      delay(500);
  calibrate(); //start calibration procedure
  //tone(pinBuzzer, 523, 1000);
     // delay(500);
}

void loop() {
  static boolean newDataReady = 0;
  const int serialPrintInterval = 0; //increase value to slow down serial print activity

  // check for new data/start next conversion:
  if (LoadCell.update()) newDataReady = true;

  // get smoothed value from the dataset:
  if (newDataReady) {
    if (millis() > t + serialPrintInterval) {
      float i = LoadCell.getData();
      //Serial.print("Valor de carga registrado: ");
      
      //Serial.println(i);
      peso=i;
      newDataReady = 0;
      t = millis();
    }

    
  }


  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = (duration*.0343)/2;
  
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin2, LOW);

  duration2 = pulseIn(echoPin2, HIGH);
  distance2 = (duration2*.0343)/2;
  
  
  //Serial.print("Distance: ");
  //Serial.println(distance);
  //Serial.print("Distance2: ");
  //Serial.println(distance2);
//delay(3000);
  // Se indica que se sento
  //Serial.println(getJSON(distance,sentado,6));      



  if(tiemposentado>500 && sentado==1 )
  {
    if(alarmatiempo==0){
      Serial.println(getJSON(tiemposentado,1,5)); 
    }
    alarmatiempo=1;
    tone(pinBuzzer, 523, 1000);
      delay(500);
  }
  else{
    tiemposentado=tiemposentado+1;
  }


  if(sentado==1 )
  {
    
    
    if(distance2-distance>5)
    {
      if(alarmaposicion==0){
      Serial.println(getJSON(distance,1,6)); 
    }
    alarmaposicion=1;
        tone(pinBuzzer, 277, 500);
      delay(500);
    }
  }
  //Serial.println(distanc);
  //Serial.println(distance);
  //Serial.println(distance);
  //Serial.println(distance);
  if(distance<=20 ){
    sentado=1;  
    if(sentadopast==0){
      Serial.println(getJSON(distance,sentado,2));      
      sentadopast=1;
      lecturasentado=1;
    }
    else{
      lecturasentado=lecturasentado+1;
    }
 
    if(lecturasentado>50 && pesoenviado==0)
    {
      Serial.println(getJSON(peso,sentado,1));  
      pesoenviado=1;     
      
    }
    
  }
  else{
    if(peso<1){
    if(sentadopast==1){
      Serial.println(getJSON(distance,sentado,4));
      
    }
    alarmatiempo=0;
    alarmaposicion=0;
    tiemposentado=0;           
    sentado=0;
    lecturasentado=0;
    pesoenviado=0;
    sentadopast=0;
    }
  }
  delay(100);
  
  // receive command from serial terminal
  if (Serial.available() > 0) {
    //delay(3000);
    char inByte = Serial.read();
    if (inByte == 't') LoadCell.tareNoDelay(); //tare
    //else if (inByte == 'r') calibrate(); //calibrate
    //else if (inByte == 'c') changeSavedCalFactor(); //edit calibration value manually
  }

  // check if last tare operation is complete
//  if (LoadCell.getTareStatus() == true) {
//    Serial.println("Tare complete");
//  }

}

void calibrate() {
  //Serial.println("***");
  //Serial.println("Start calibration:");
  //Serial.println("Place the load cell an a level stable surface.");
  //Serial.println("Remove any load applied to the load cell.");
  //Serial.println("Send 'ta' from serial monitor to set the tare offset.");

  boolean _resume = false;
  while (_resume == false) {
    LoadCell.update();
    //if (Serial.available() > 0) {
      //if (Serial.available() > 0) {
        char inByte = 't';//Serial.read();
//        _resume = false;
//  int loadval = 0;
//  while (_resume == false) {
//    loadval = loadval + 1;
//    Serial.print('.');
//    if(loadval>5000){
//      _resume = true;
//      
//    }
//  }
        //if (inByte == 't') 
        LoadCell.tareNoDelay();
        _resume = true;
      //}
    //}
    if (LoadCell.getTareStatus() == true) {
      //Serial.println("Tare complete");
      _resume = true;
    }
  }

 // Serial.println("Now, place your known mass on the loadcell.");
  //Serial.println("Then send the weight of this mass (i.e. 100.0) from serial monitor.");

//  _resume = false;
//  int loadval = 0;
//  while (_resume == false) {
//    loadval = loadval + 1;
//    Serial.print('.');
//    if(loadval>5000){
//      _resume = true;
//      
//    }
//  }
int loadval = 0;
  float known_mass = pesoInicial;
  _resume = false;
  while (_resume == false) {
    LoadCell.update();
    loadval=loadval+1;
    Serial.println(getJSON(loadval,sentado,3));  
    if (Serial.available() > 0 or loadval>300) {
      known_mass = pesoInicial;//Serial.parseFloat();
      if (known_mass != 0) {
        //Serial.print("Known mass is: ");
        //Serial.println(known_mass);
        _resume = true;
     }
    }
  }

  LoadCell.refreshDataSet(); //refresh the dataset to be sure that the known mass is measured correct
  float newCalibrationValue = LoadCell.getNewCalibration(known_mass); //get the new calibration value

  //Serial.print("New calibration value has been set to: ");
  //Serial.print(newCalibrationValue);
  //Serial.println(", use this as calibration value (calFactor) in your project sketch.");
  //Serial.print("Save this value to EEPROM adress ");
  //Serial.print(calVal_eepromAdress);
  //Serial.println("? y/n");

  _resume = true;
  while (_resume == false) {
    if (Serial.available() > 0) {
      char inByte = Serial.read();
      if (inByte == 'y') {
#if defined(ESP8266)|| defined(ESP32)
        EEPROM.begin(512);
#endif
        EEPROM.put(calVal_eepromAdress, newCalibrationValue);
#if defined(ESP8266)|| defined(ESP32)
        EEPROM.commit();
#endif
        EEPROM.get(calVal_eepromAdress, newCalibrationValue);
        Serial.print("Value ");
        Serial.print(newCalibrationValue);
        Serial.print(" saved to EEPROM address: ");
        Serial.println(calVal_eepromAdress);
        _resume = true;

      }
      else if (inByte == 'n') {
        Serial.println("Value not saved to EEPROM");
        _resume = true;
      }
    }
  }

  //Serial.println("End calibration");
  //Serial.println("***");
  //Serial.println("To re-calibrate, send 'r' from serial monitor.");
  //Serial.println("For manual edit of the calibration value, send 'c' from serial monitor.");
  //Serial.println("***");
}

void changeSavedCalFactor() {
  float oldCalibrationValue = LoadCell.getCalFactor();
  boolean _resume = false;
  Serial.println("***");
  Serial.print("Current value is: ");
  Serial.println(oldCalibrationValue);
  Serial.println("Now, send the new value from serial monitor, i.e. 696.0");
  float newCalibrationValue;
  while (_resume == false) {
    if (Serial.available() > 0) {
      newCalibrationValue = Serial.parseFloat();
      if (newCalibrationValue != 0) {
        Serial.print("New calibration value is: ");
        Serial.println(newCalibrationValue);
        LoadCell.setCalFactor(newCalibrationValue);
        _resume = true;
      }
    }
  }
  _resume = false;
  Serial.print("Save this value to EEPROM adress ");
  Serial.print(calVal_eepromAdress);
  Serial.println("? y/n");
  while (_resume == false) {
    if (Serial.available() > 0) {
      char inByte = Serial.read();
      if (inByte == 'y') {
#if defined(ESP8266)|| defined(ESP32)
        EEPROM.begin(512);
#endif
        EEPROM.put(calVal_eepromAdress, newCalibrationValue);
#if defined(ESP8266)|| defined(ESP32)
        EEPROM.commit();
#endif
        EEPROM.get(calVal_eepromAdress, newCalibrationValue);
        Serial.print("Value ");
        Serial.print(newCalibrationValue);
        Serial.print(" saved to EEPROM address: ");
        Serial.println(calVal_eepromAdress);
        _resume = true;
      }
      else if (inByte == 'n') {
        Serial.println("Value not saved to EEPROM");
        _resume = true;
      }
    }
  }
  Serial.println("End change calibration value");
  Serial.println("***");
}

String getJSON(float valor, int sentado, int tipo){
  String svalor = "\"valor\": " ;
  svalor.concat(valor);
  String sestado= "\"estado\": " ;
  sestado.concat(sentado);
  String stipo = "\"tipo\": ";
  stipo.concat(tipo);
  return "{" + stipo + "," + svalor + "," + sestado + "}"; 
  }
