---
title: Azure 실습 중 겪었던 장애와 트러블슈팅 모음
date: 2026-06-08
category: Cloud
tags: Azure, Troubleshooting, Infra, NSG, NAT Gateway, Load Balancer, Tomcat, Apache
excerpt: Azure 실습 중 직접 겪었던 Private VM 인터넷 불가, Tomcat 실행 오류, systemd 장애, NSG 문제, Reverse Proxy 오류, Load Balancer Probe 실패 등의 트러블슈팅 과정을 정리했습니다.
---

# Azure 실습 중 겪었던 장애와 트러블슈팅 모음

## 들어가며

클라우드를 공부하면서 가장 많이 배운 것은 서비스를 만드는 방법보다 장애를 해결하는 방법이었다.

Azure Portal에서는 버튼 몇 번만 누르면 VM과 네트워크를 만들 수 있다. 하지만 실제로 실습을 진행해 보면, 예상하지 못한 문제들이 계속 나타났다. 어떤 때는 네트워크가 막혀 있었고, 어떤 때는 서비스가 실행되는 것처럼 보이는데도 접속이 되지 않았다.

이번 글에서는 Azure 실습 과정에서 직접 겪었던 장애와, 그 원인을 어떻게 찾고 해결했는지를 정리해 보려고 한다.

---

## 1. Private VM에서 인터넷이 되지 않았다

### 증상

Private Subnet에 배치한 VM에서 다음 명령이 실패했다.

```bash
apt update
```

패키지 다운로드가 진행되지 않았고, 외부 서버와 통신도 되지 않았다.

### 원인

Private VM에는 Public IP가 없었다.

또한 NAT Gateway도 연결되어 있지 않았다.

즉, 구조상 인터넷으로 나갈 수 있는 경로 자체가 없는 상태였다.

```text
Private VM
  |
  X
Internet connection path 없음
```

### 해결

NAT Gateway를 생성하고 Private Subnet에 연결했다.

구성 후에는 다음 명령들이 정상적으로 동작했다.

```bash
apt update
apt install
curl google.com
```

### 배운 점

Private VM은 Public IP가 없더라도 NAT Gateway를 통해 외부 인터넷으로 나갈 수 있다.

---

## 2. Tomcat이 실행되는데 웹 페이지가 열리지 않았다

### 증상

Tomcat 서비스를 실행했다.

```bash
systemctl start tomcat
```

실행은 된 것처럼 보였지만, 아래 주소로 접속해도 페이지가 열리지 않았다.

```text
http://IP:8080
```

### 원인

Tomcat 버전과 Java 버전 사이에 호환성 문제가 있었다.

또한 환경 변수 설정 일부가 빠져 있었다.

### 해결

- Java 버전 재설치
- `CATALINA_HOME` 재설정
- Tomcat 재설치

이후에는 정상적으로 접속할 수 있었다.

### 배운 점

Tomcat 장애는 대부분 아래 세 가지 중 하나에서 많이 발생했다.

- Java 버전
- 환경 변수
- 포트 충돌

---

## 3. systemd 서비스가 계속 죽었다

### 증상

다음 명령으로 Tomcat 서비스를 실행했지만,

```bash
systemctl start tomcat
```

곧바로 종료되었다.

상태를 확인해 보니 `StartLimitHit` 오류가 발생하고 있었다.

### 원인

systemd가 여러 번 실패한 서비스를 자동으로 차단한 상태였다.

### 해결

먼저 실패 상태를 초기화한 뒤 다시 실행했다.

```bash
systemctl reset-failed tomcat
```

추가로 아래 명령으로 실제 오류 로그를 확인했다.

```bash
journalctl -xe
```

### 배운 점

서비스가 죽는 이유를 감으로 추측하기보다, 로그를 먼저 확인하는 습관이 중요하다는 걸 배웠다.

---

## 4. SSH 접속이 되지 않았다

### 증상

다음 명령으로 접속을 시도했지만 실패했다.

```bash
ssh azureuser@VM_IP
```

### 원인

NSG에서 22번 포트가 허용되지 않은 상태였다.

### 해결

Inbound Rule에 `TCP 22`를 추가했다.

### 배운 점

클라우드 환경에서 접속이 되지 않을 때는 방화벽 설정부터 먼저 확인하는 게 가장 빠르다.

---

## 5. Ping이 안 되는데 서버는 살아있었다

### 증상

아래 명령은 실패했다.

```bash
ping 서버IP
```

하지만 아래 명령은 성공했다.

```bash
curl 서버IP
```

### 원인

Azure에서는 기본적으로 ICMP가 허용되지 않는 경우가 많다.

즉, Ping이 되지 않는다고 해서 서버가 죽은 것은 아니었다.

### 해결

Ping만으로 상태를 판단하지 않고, 아래와 같은 방식으로 실제 서비스 응답을 확인했다.

- `curl`
- `nc`
- `telnet`

### 배운 점

Ping은 여러 확인 방법 중 하나일 뿐이고, 실제 서비스 상태는 다른 도구로도 충분히 확인할 수 있다.

---

## 6. Reverse Proxy가 동작하지 않았다

### 증상

Apache를 통해 `/api` 요청을 WAS 서버로 전달하려고 했지만, 아래와 같은 오류가 발생했다.

- `404`
- `502 Bad Gateway`

### 원인

`ProxyPass` 경로가 잘못 설정되어 있었다.

또한 `mod_proxy` 모듈이 활성화되지 않은 상태였다.

### 해결

Apache 설정을 아래와 같이 수정했다.

```apache
ProxyPass /api http://10.0.2.6:8080/
ProxyPassReverse /api http://10.0.2.6:8080/
```

필요한 프록시 모듈도 함께 활성화했다.

### 배운 점

Reverse Proxy 장애는 대부분 아래 항목들 중 하나에서 발생했다.

- 포트
- 경로
- 모듈

---

## 7. Public IP를 붙였는데 설계가 이상했다

### 증상

처음에는 모든 VM에 Public IP를 부여해서 구성했다.

### 문제점

동작은 했지만, 운영 환경 기준으로 보면 보안적으로 좋은 구조는 아니었다.

외부에서 각 서버에 직접 접근할 수 있는 상태였기 때문이다.

### 개선

구조를 아래와 같이 바꿨다.

```text
Internet
  |
Load Balancer
  |
Web Server
  |
WAS Server
```

WAS 서버는 Private Subnet에 위치하도록 수정했다.

### 배운 점

서비스 서버는 가능한 한 외부에 직접 노출하지 않는 방향으로 설계하는 것이 좋다.

---

## 8. Load Balancer 뒤에 있는 서버가 응답하지 않았다

### 증상

Load Balancer 자체는 정상처럼 보였지만, 실제 요청은 서버까지 전달되지 않았다.

### 원인

Health Probe가 실패하고 있었다.

Azure Load Balancer는 Probe가 성공한 서버에게만 트래픽을 전달한다.

### 해결

서비스 포트와 Probe 포트를 다시 맞춰 설정했다.

### 배운 점

Load Balancer 문제는 단순히 연결 문제라기보다, Health Probe 설정에서 시작되는 경우가 많다는 걸 알게 되었다.

---

## 9. NSG 규칙을 수정했는데도 접속이 안 됐다

### 증상

분명히 규칙을 열었는데도 접속이 계속 실패했다.

### 원인

잘못된 NSG에 규칙을 적용하고 있었다.

실제로는 다른 NSG가 Subnet에 연결되어 있었다.

### 해결

NSG 규칙 자체보다, 어떤 NSG가 어디에 연결되어 있는지부터 다시 확인했다.

### 배운 점

규칙 내용을 보기 전에, 그 규칙이 실제로 어디에 적용되고 있는지 먼저 확인해야 한다.

---

## 마치며

이번 Azure 실습에서 가장 크게 느낀 점은, 클라우드는 결국 네트워크와 연결 구조를 이해하는 싸움에 가깝다는 것이었다.

실제로 많은 장애가 아래 항목들 중 하나에서 발생했다.

- NSG
- Routing
- NAT Gateway
- Load Balancer
- DNS

서비스를 만드는 것도 중요하지만, 장애 원인을 하나씩 찾고 해결하는 과정에서 훨씬 더 많은 것을 배울 수 있었다.

앞으로는 Azure뿐 아니라 AWS 환경에서도 비슷한 구조를 직접 구축해 보면서, 이런 문제들을 더 스스로 해결할 수 있는 경험을 쌓아가고 싶다.

---

Azure 실습 전체 흐름과 아키텍처 회고는 아래 글에서 이어서 볼 수 있다.

[Azure 클라우드 실습 회고 - 인프라 엔지니어의 첫 걸음](/posts/azure-cloud-lab-retrospective)
