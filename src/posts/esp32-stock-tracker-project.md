---
title: "내 책상 위의 금융 인프라: ESP32-S3 Mini 실시간 주식 트래커 제작기"
date: 2026-04-07
category: Hardware
tags: ESP32-S3, Arduino, IoT, Embedded, Infrastructure, Tailscale, StockTracker
excerpt: ESP32-S3 Mini와 OLED, 터치 센서를 활용해 실시간 주식 데이터를 시각화하고, Mac Mini M4 Pro 서버와 Tailscale을 연동한 원격 개발 환경을 구축해 봅니다.
---

# 내 책상 위의 금융 인프라: ESP32-S3 실시간 주식 트래커

단순히 모니터 구석에 띄워놓는 위젯이 아니라, 물리적인 '실체'가 있는 대시보드를 만드는 것은 엔지니어에게 특별한 즐거움입니다. 이번 프로젝트에서는 **ESP32-S3 Mini**를 메인 MCU로 사용하고, 제가 구축한 **Mac Mini M4 Pro** 서버 인프라를 활용하여 언제 어디서든 수정 가능한 실시간 주식 트래커를 제작해 보았습니다.

---

## 1. 하드웨어 아키텍처 및 배선 가이드

### 주요 부품 구성
- **MCU:** ESP32-S3 Mini (강력한 WiFi 성능과 소형 폼팩터)
- **Display:** 0.96" OLED (SSD1306, I2C 통신)
- **Indicators:** Red/Green LED (하락/상승 직관적 표시)
- **Input:** GPIO 7번 핀을 활용한 정전식 터치 센서
- **Protection:** LED 보호용 220Ω 저항

### 💡 브레드보드 배선 팁
1. **공통 그라운드(GND) 확보:** ESP32의 GND 핀을 브레드보드의 마이너스(-) 라인에 연결하여 모든 소자가 안정적으로 전원을 공유하게 합니다.
2. **I2C 배선 주의:** OLED의 SDA(데이터)와 SCL(클럭) 핀은 ESP32의 지정된 하드웨어 I2C 핀에 연결해야 합니다. (S3 Mini 기준 기본 SDA: GPIO 8, SCL: GPIO 9 추천)
3. **LED 방향성:** 긴 다리(애노드)가 저항을 거쳐 GPIO로, 짧은 다리(캐소드)가 GND로 가야 합니다.

---

## 2. 소프트웨어 핵심 로직 분석

컴퓨터공학 전공자라면 단순히 코드를 복사하는 것이 아니라, 통신의 흐름과 이벤트 처리 방식을 이해하는 것이 중요합니다.

### ① WiFi 기반 HTTP 통신 (Yahoo Finance API)
전용 앱이나 브라우저 대신 `HTTPClient` 라이브러리를 사용해 야후 파이낸스의 데이터를 가져옵니다. JSON 파싱에는 `ArduinoJson` 라이브러리를 활용하여 메모리 효율을 극대화했습니다.

```cpp
void fetchStockData(String symbol) {
  HTTPClient http;
  String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol;
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode > 0) {
    String payload = http.getString();
    // JSON 파싱 로직 (가격, 변동률 추출)
    // 상승/하락 여부에 따른 LED DigitalWrite 제어
  }
  http.end();
}
```

### ② 정전식 터치 센서 설정 (GPIO 7)
물리 버튼은 시간이 지나면 접점 불량이 발생할 수 있지만, ESP32의 내장 터치 센서는 훨씬 견고합니다. `touchRead()` 함수를 사용하여 값이 임계값(Threshold) 이하로 떨어질 때 종목이 전환되도록 설계했습니다.

**터치 센서 튜닝 팁:**
- 기본 상태에서 `touchRead(7)`를 출력해 보면 보통 40~50 정도의 값이 나옵니다.
- 손가락이 닿으면 이 값이 10~15 정도로 급격히 떨어집니다.
- **Threshold 설정:** 약 20 정도로 설정하면 오작동 없이 부드러운 터치감을 얻을 수 있습니다.

---

## 3. 인프라 엔지니어의 터치: Tailscale과 원격 개발

제 개발 환경은 M1 MacBook Air이지만, 메인 로직 처리나 모니터링은 **Mac Mini M4 Pro** 서버에서 수행됩니다.

- **Tailscale 활용:** 가상 프라이빗 네트워크(VPN)를 통해 외부 카페에서도 제 방의 Mac Mini에 SSH로 접속하거나, 원격으로 ESP32의 시리얼 로그를 모니터링할 수 있습니다.
- **개발 워크플로우:** 로컬에서 코딩 -> Tailscale을 통해 서버에 Push -> 서버에서 원격 컴파일 및 업로드(CLI 활용)라는 현대적인 인프라 워크플로우를 하드웨어 개발에도 적용했습니다.

---

## 4. 마치며: 하드웨어가 주는 피드백의 가치

$TSLA, $PLTR, $LLY와 같이 제가 관심 있는 종목의 가격이 변할 때마다 책상 위의 초록색 LED가 반짝이는 것은 단순한 수치 확인 이상의 만족감을 줍니다. 

컴퓨터공학을 전공하며 가상 세계의 데이터만 다루다가, 이렇게 실제 전기가 흐르고 물리적인 빛으로 변환되는 과정을 제어하는 것은 엔지니어로서의 시야를 넓혀주는 소중한 경험입니다. 여러분도 자신만의 '물리적 대시보드'를 만들어 보시길 바랍니다!
