---
title: TCP/IP 4계층 모델과 소켓 프로그래밍 실습 (C언어)
date: 2026-04-07
category: Network
tags: 네트워크, TCP/IP, C언어, 소켓프로그래밍
excerpt: 네트워크의 핵심인 TCP/IP 4계층 모델을 알아보고, C언어를 이용해 TCP와 UDP 통신을 직접 구현해 봅니다.
---

# TCP/IP 4계층 모델과 실습

네트워크 통신의 표준 모델인 TCP/IP 4계층 모델은 우리가 인터넷을 통해 데이터를 주고받는 원리를 설명합니다. 각 계층의 역할과 함께, 전송 계층의 핵심인 TCP와 UDP를 C언어 코드로 직접 구현하며 이해해 보겠습니다.

---

## 1. TCP/IP 4계층 모델 이해하기

TCP/IP 모델은 복잡한 네트워크 통신 과정을 4개의 독립적인 계층으로 나눕니다. 각 계층은 하위 계층의 기능을 사용하고 상위 계층에 서비스를 제공합니다.

### 1계층: 네트워크 인터페이스 계층 (Network Interface Layer)
- **역할:** 물리적인 네트워크 매체(이더넷, Wi-Fi 등)를 통해 데이터를 전기적 신호로 변환하여 전송합니다.
- **주요 프로토콜:** Ethernet, Wi-Fi, PPP
- **데이터 단위:** Frame

### 2계층: 인터넷 계층 (Internet Layer)
- **역할:** 패킷을 목적지 주소(IP)까지 최적의 경로로 전달하는 라우팅을 담당합니다.
- **주요 프로토콜:** IP, ICMP, ARP
- **데이터 단위:** Packet (or Datagram)

### 3계층: 전송 계층 (Transport Layer)
- **역할:** 양 끝단의 프로세스 간의 통신을 제어합니다. 데이터의 신뢰성을 보장하거나 속도를 우선시하는 방식을 결정합니다.
- **주요 프로토콜:** **TCP**, **UDP**
- **데이터 단위:** Segment (TCP), Datagram (UDP)

### 4계층: 응용 계층 (Application Layer)
- **역할:** 사용자가 네트워크에 접속할 수 있도록 인터페이스를 제공하며, 특정 서비스를 위한 통신 규약을 정의합니다.
- **주요 프로토콜:** HTTP, FTP, DNS, SMTP
- **데이터 단위:** Message (Data)

---

## 2. TCP vs UDP 비교

| 특징 | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **연결 방식** | 연결 지향 (3-way handshaking) | 비연결 지향 |
| **신뢰성** | 높음 (순서 보장, 흐름 제어, 오류 제어) | 낮음 (데이터 손실 가능성 있음) |
| **속도** | 상대적으로 느림 | 매우 빠름 |
| **용도** | 웹 브라우징(HTTP), 파일 전송(FTP), 이메일 | 스트리밍, 온라인 게임, VoIP, DNS |

---

## 3. C언어 실습: TCP (Echo Server & Client)

TCP는 안정적인 연결을 위해 `listen`, `accept`, `connect` 과정을 거칩니다.

### [TCP Server: tcp_server.c]
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

void error_handling(char *message);

int main(int argc, char *argv[]) {
    int serv_sock, clnt_sock;
    struct sockaddr_in serv_adr, clnt_adr;
    socklen_t clnt_adr_sz;
    char message[1024];
    int str_len;

    if (argc != 2) {
        printf("Usage : %s <port>\n", argv[0]);
        exit(1);
    }

    serv_sock = socket(PF_INET, SOCK_STREAM, 0);
    memset(&serv_adr, 0, sizeof(serv_adr));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_adr.sin_port = htons(atoi(argv[1]));

    if (bind(serv_sock, (struct sockaddr*)&serv_adr, sizeof(serv_adr)) == -1)
        error_handling("bind() error");

    if (listen(serv_sock, 5) == -1)
        error_handling("listen() error");

    clnt_adr_sz = sizeof(clnt_adr);
    clnt_sock = accept(serv_sock, (struct sockaddr*)&clnt_adr, &clnt_adr_sz);
    
    while ((str_len = read(clnt_sock, message, sizeof(message))) > 0) {
        write(clnt_sock, message, str_len);
    }

    close(clnt_sock);
    close(serv_sock);
    return 0;
}

void error_handling(char *message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```

### [TCP Client: tcp_client.c]
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

void error_handling(char *message);

int main(int argc, char *argv[]) {
    int sock;
    struct sockaddr_in serv_adr;
    char message[1024];
    int str_len;

    if (argc != 3) {
        printf("Usage : %s <IP> <port>\n", argv[0]);
        exit(1);
    }

    sock = socket(PF_INET, SOCK_STREAM, 0);
    memset(&serv_adr, 0, sizeof(serv_adr));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = inet_addr(argv[1]);
    serv_adr.sin_port = htons(atoi(argv[2]));

    if (connect(sock, (struct sockaddr*)&serv_adr, sizeof(serv_adr)) == -1)
        error_handling("connect() error!");

    while (1) {
        fputs("Input message(Q to quit): ", stdout);
        fgets(message, sizeof(message), stdin);
        
        if (!strcmp(message, "q\n") || !strcmp(message, "Q\n")) break;

        write(sock, message, strlen(message));
        str_len = read(sock, message, sizeof(message) - 1);
        message[str_len] = 0;
        printf("Message from server: %s", message);
    }

    close(sock);
    return 0;
}

void error_handling(char *message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```

---

## 4. C언어 실습: UDP (Message Transfer)

UDP는 연결 과정 없이 데이터를 즉시 전송하며, `sendto`와 `recvfrom` 함수를 사용합니다.

### [UDP Server: udp_server.c]
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define BUF_SIZE 1024
void error_handling(char *message);

int main(int argc, char *argv[]) {
    int serv_sock;
    char message[BUF_SIZE];
    int str_len;
    socklen_t clnt_adr_sz;
    struct sockaddr_in serv_adr, clnt_adr;

    if (argc != 2) {
        printf("Usage : %s <port>\n", argv[0]);
        exit(1);
    }

    serv_sock = socket(PF_INET, SOCK_DGRAM, 0);
    memset(&serv_adr, 0, sizeof(serv_adr));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_adr.sin_port = htons(atoi(argv[1]));

    if (bind(serv_sock, (struct sockaddr*)&serv_adr, sizeof(serv_adr)) == -1)
        error_handling("bind() error");

    while (1) {
        clnt_adr_sz = sizeof(clnt_adr);
        str_len = recvfrom(serv_sock, message, BUF_SIZE, 0,
                           (struct sockaddr*)&clnt_adr, &clnt_adr_sz);
        sendto(serv_sock, message, str_len, 0,
               (struct sockaddr*)&clnt_adr, clnt_adr_sz);
    }
    close(serv_sock);
    return 0;
}

void error_handling(char *message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```

### [UDP Client: udp_client.c]
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define BUF_SIZE 1024
void error_handling(char *message);

int main(int argc, char *argv[]) {
    int sock;
    char message[BUF_SIZE];
    int str_len;
    socklen_t adr_sz;
    struct sockaddr_in serv_adr, from_adr;

    if (argc != 3) {
        printf("Usage : %s <IP> <port>\n", argv[0]);
        exit(1);
    }

    sock = socket(PF_INET, SOCK_DGRAM, 0);
    memset(&serv_adr, 0, sizeof(serv_adr));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = inet_addr(argv[1]);
    serv_adr.sin_port = htons(atoi(argv[2]));

    while (1) {
        fputs("Insert message(q to quit): ", stdout);
        fgets(message, sizeof(message), stdin);
        if (!strcmp(message, "q\n") || !strcmp(message, "Q\n")) break;

        sendto(sock, message, strlen(message), 0,
               (struct sockaddr*)&serv_adr, sizeof(serv_adr));
        adr_sz = sizeof(from_adr);
        str_len = recvfrom(sock, message, BUF_SIZE, 0,
                           (struct sockaddr*)&from_adr, &adr_sz);
        message[str_len] = 0;
        printf("Message from server: %s", message);
    }
    close(sock);
    return 0;
}

void error_handling(char *message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```


---

## 요약

- **TCP/IP 4계층:** 네트워크 인터페이스 -> 인터넷 -> 전송 -> 응용
- **TCP:** 신뢰성이 필요한 곳에 사용 (가상 회선 방식)
- **UDP:** 속도가 중요한 실시간 서비스에 사용 (데이터그램 방식)

직접 위 코드를 컴파일하고 실행하여 소켓 통신의 기본 원리를 익혀보시기 바랍니다! (컴파일 예: `gcc tcp_server.c -o tserver`)
