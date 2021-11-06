#include <HardwareSerial.h>

HardwareSerial SerialMon(1);
//HardwareSerial SerialGprs(2);

#define TIME_TEST    1000  //TEST DEBUGGER
#define TIME_JSON     100  //ENVIOS JSON

#define MON_RX_PIN 16
#define MON_TX_PIN 17
#define MON_BAUD_RATE 9600

#define GPRS_RX_PIN 4
#define GPRS_TX_PIN 2
#define GPRS_BAUD_RATE 115200

#define DEBUGER 9600

#define null 0
#define LED_ON                      LOW
#define LED_OFF                     HIGH

// opcion 1 - sendPOST
const char* serverName = "http://192.168.10.75:5001/arqui2p2/add";
void sendPOST(const char* serverName, String httpRequestData);

// opcion 2 - sendPOST    
const char server[] = "http://192.168.10.75:5001/arqui2p2";  
const char resource[] = "/add"; 
int port = 5001;
bool httpPOST(const char server[], const char resource[], int port, String httpRequestData);
