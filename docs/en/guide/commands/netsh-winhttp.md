---
title: Проксі-сервер
description: netsh winhttp • налаштування проксі-сервера
---

# Налаштування проксі-сервера

Налаштування проксі-сервера за допомогою команди **[netsh](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/netsh 'Microsoft Dosc')**.
Службова програма командного рядка, яка дозволяє відображати або змінювати мережеву конфігурацію комп'ютера, або локально, або віддалено.

## Тунелювати весь інтернет-трафік через проксі

```cmd
netsh winhttp set proxy proxy-server="http://proxy:port" bypass-list="127.0.0.1;localhost"
```

## Параметри

- `proxy-server` адреса проксі-сервера
- `bypass-list` список винятків, розділених `;`
- `/?` відображає довідку стосовно команди.

## Переглянути поточні налаштування проксі

```cmd
netsh winhttp show proxy
```

## Скинути всі налаштування проксі

```cmd
netsh winhttp reset proxy
```
