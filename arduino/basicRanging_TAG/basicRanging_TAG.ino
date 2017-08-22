/**
 * 
 * @todo
 *  - move strings to flash (less RAM consumption)
 *  - fix deprecated convertation form string to char* startAsTag
 *  - give example description
 */
#include <SPI.h>
#include "DW1000Ranging.h"

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;

HTTPClient http;

// connection pins
const uint8_t     PIN_RST = 5; // reset pin
const uint8_t     PIN_IRQ = 4; // irq pin
const uint8_t     PIN_SS = SS; // spi select pin
const uint16_t    addr=0xEC03; // device address
char              id[]="82:17:5B:D5:A9:9A:E2:03"; //device id

void setup() {
  Serial.begin(115200);
//  delay(1000);
  WIFI_setup();

  
  //init the configuration
  DW1000Ranging.initCommunication(PIN_RST, PIN_SS, PIN_IRQ); //Reset, CS, IRQ pin
  //define the sketch as anchor. It will be great to dynamically change the type of module
  DW1000Ranging.attachNewRange(newRange);
  DW1000Ranging.attachNewDevice(newDevice);
  DW1000Ranging.attachInactiveDevice(inactiveDevice);
  DW1000Ranging.attachTransmit(WIFI_transmit);
  //Enable the filter to smooth the distance
  //DW1000Ranging.useRangeFilter(true);
  
  //we start the module as a tag
  DW1000Ranging.startAsTag(id, DW1000.MODE_LONGDATA_RANGE_ACCURACY,addr);
  char msg[128];
  DW1000.getPrintableDeviceIdentifier(msg);
  Serial.print("Device ID: "); Serial.println(msg);
  DW1000.getPrintableExtendedUniqueIdentifier(msg);
  Serial.print("Unique ID: "); Serial.println(msg);
  DW1000.getPrintableNetworkIdAndShortAddress(msg);
  Serial.print("Network ID & Device Address: "); Serial.println(msg);
  DW1000.getPrintableDeviceMode(msg);
  Serial.print("Device mode: "); Serial.println(msg);

//  while(WiFiMulti.run() != WL_CONNECTED)
//  {
//    
//  }
}

void loop() {
  DW1000Ranging.loop();
}

void newRange() {
  Serial.println("from: "); Serial.print(DW1000Ranging.getDistantDevice()->getShortAddress(), HEX);
  Serial.print("\t Range: "); Serial.print(DW1000Ranging.getDistantDevice()->getRange()); Serial.print(" m");
  Serial.print("\t RX power: "); Serial.print(DW1000Ranging.getDistantDevice()->getRXPower()); Serial.println(" dBm");

//  WIFI_transmit(String(DW1000Ranging.getDistantDevice()->getShortAddress(),HEX),String(DW1000Ranging.getDistantDevice()->getRange()));
}

void newDevice(DW1000Device* device) {
  Serial.print("ranging init; 1 device added ! -> ");
  Serial.print(" short:");
  Serial.println(device->getShortAddress(), HEX);
}

void inactiveDevice(DW1000Device* device) {
  Serial.print("delete inactive device: ");
  Serial.println(device->getShortAddress(), HEX);
}

void WIFI_setup() {
  
    for(uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] WAIT %d...\n", t);
        Serial.flush();
        delay(1000);
    }

    WiFiMulti.addAP("Shyam wifi 2", "Shyam289");

    // allow reuse (if server supports it)
    http.setReuse(true);

//    while((WiFiMulti.run() != WL_CONNECTED))
//    {
//    }
}
void WIFI_transmit() {
  Serial.print("Iam here at transmit");
//  Serial.printf("number %d",DW1000Ranging.getNetworkDevicesNumber());
//  Serial.println();
  String result = "{";
  String uid = "";
  String Dist = "";
   for(uint8_t id = 0; id < DW1000Ranging.getNetworkDevicesNumber(); id++) {
      uid = String(DW1000Ranging.getDistantDeviceById(id)->getShortAddress(),HEX);
      uid.toUpperCase();
      if(id != 0){
        result = result + ",";
      }
      result = result + "\"" + uid + "\":" + String(DW1000Ranging.getDistantDeviceById(id)->getRange());
      
  } 
  result = result + "}";

  uid = String(addr,HEX);
  uid.toUpperCase();
  
  String httpurl="http://192.168.43.79/write?uid=" + uid + "&result=" + result;
  Serial.println(httpurl);

    if((WiFiMulti.run() == WL_CONNECTED)) {
//        Serial.print(httpurl);
        http.begin(httpurl);
        //http.begin("192.168.1.12", 80, "/test.html");

        int httpCode = http.GET();
        if(httpCode > 0) {
//            Serial.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                http.writeToStream(&Serial);
                Serial.print(httpurl);
            }

        } else {
            Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
//        delay(3000);
    }
}
//void WIFI_transmit(String uid,String dist) {
////  Serial.print("check1");
//  if((WiFiMulti.run() == WL_CONNECTED)) {
//        String httpurl="http://ec2-52-37-49-247.us-west-2.compute.amazonaws.com:8080/write?uid=";
//        uid.toUpperCase();
//        httpurl=httpurl+uid;
//        httpurl=httpurl+"&dist="+dist;
////        Serial.print(httpurl);
//        http.begin(httpurl);
//        //http.begin("192.168.1.12", 80, "/test.html");
//
//        int httpCode = http.GET();
//        if(httpCode > 0) {
////            Serial.printf("[HTTP] GET... code: %d\n", httpCode);
//
//            // file found at server
//            if(httpCode == HTTP_CODE_OK) {
////                http.writeToStream(&Serial);
//                Serial.print("SENT through WIFI");
//            }
//
//        } else {
//            Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
//        }
//
//        http.end();
//    }
//
//    delay(1000);
////    Serial.print("check1");
//}

