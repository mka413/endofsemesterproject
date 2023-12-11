#define ACTION_BUTTON_PIN 2
#define RESTART_BUTTON_PIN 5

bool isActionButtonPressed = false;
bool isRestartButtonPressed = false;


void setup() {
  Serial.begin(9600);

  pinMode(ACTION_BUTTON_PIN, INPUT);
  pinMode(RESTART_BUTTON_PIN, INPUT);


}

void loop() {

  if(digitalRead(ACTION_BUTTON_PIN)) {
    if(!isActionButtonPressed) {

      eventActionButtonPressed(ACTION_BUTTON_PIN);

      isActionButtonPressed = true;
    }
  }
  else {
    if(isActionButtonPressed) {

      eventActionButtonReleased(ACTION_BUTTON_PIN);

      isActionButtonPressed = false;
    }  
  }

  if(digitalRead(RESTART_BUTTON_PIN)) {
    if(!isRestartButtonPressed) {

      eventRestartButtonPressed(RESTART_BUTTON_PIN);

      isRestartButtonPressed = true;
    }
  }
  else {
    if(isRestartButtonPressed) {

      eventRestartButtonReleased(RESTART_BUTTON_PIN);

      isRestartButtonPressed = false;
    }  
  }

}


void eventActionButtonPressed(int pin) {
  Serial.println(String(pin) + ":pressed");
}

void eventActionButtonReleased(int pin) {
  Serial.println(String(pin) + ":released");
}

void eventRestartButtonPressed(int pin) {
  Serial.println(String(pin) + ":pressed");
}

void eventRestartButtonReleased(int pin) {
  Serial.println(String(pin) + ":released");
}
