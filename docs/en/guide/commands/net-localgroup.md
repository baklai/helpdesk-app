---
title: Управління локальними групами
description: net localgroup • управління локальними групами
---

# Управління локальними групами

Команда **[net localgroup](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/net-localgroup 'Microsoft Dosc')** дозволяє виконувати операції з локальними групами на комп'ютері.

## Синтаксис

```cmd
net localgroup [<ім'я_групи>] [/add] [/delete] [/addmember] [/domain]
```

## Параметри

- `[<ім'я_групи>]` вказує ім'я локальної групи для виконання дії.
- `/add` створити нову локальну групу.
- `/delete` видалити локальну групу.
- `/addmember` додати користувача до локальної групи.
- `/domain` виконати дію на доменному контролері (якщо комп'ютер є частиною домену).
- `/?` відображає довідку стосовно команди.

## Приклади

1. Створити нову локальну групу

```cmd
net localgroup NewGroup /add
```

2. Додати користувача до локальної групи

```cmd
net localgroup ExistingGroup UserName /addmember
```
