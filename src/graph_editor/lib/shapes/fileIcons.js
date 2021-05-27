/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

// We use Font Awesome icons for file attachment icons.
// These shapes are SVGs that are from the stencil used in
// this link: https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fjgraph.github.io%2Fdrawio-libs%2Flibs%2Ffont-awesome.xml
// The imageData attribute for each icon is extracted from that stencil.

const icons = [
  // PDF files
  // icon: file-pdf-o
  // url: https://fontawesome.com/v4.7.0/icon/file-pdf-o
  {
    extensions: ['pdf'],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS01MTQtNTkzcTMzIDI2IDg0IDU2IDU5LTcgMTE3LTcgMTQ3IDAgMTc3IDQ5IDE2IDIyIDIgNTIgMCAxLTEgMmwtMiAydjFxLTYgMzgtNzEgMzgtNDggMC0xMTUtMjB0LTEzMC01M3EtMjIxIDI0LTM5MiA4My0xNTMgMjYyLTI0MiAyNjItMTUgMC0yOC03bC0yNC0xMnEtMS0xLTYtNS0xMC0xMC02LTM2IDktNDAgNTYtOTEuNXQxMzItOTYuNXExNC05IDIzIDYgMiAyIDIgNCA1Mi04NSAxMDctMTk3IDY4LTEzNiAxMDQtMjYyLTI0LTgyLTMwLjUtMTU5LjV0Ni41LTEyNy41cTExLTQwIDQyLTQwaDIycTIzIDAgMzUgMTUgMTggMjEgOSA2OC0yIDYtNCA4IDEgMyAxIDh2MzBxLTIgMTIzLTE0IDE5MiA1NSAxNjQgMTQ2IDIzOHptLTU3NiA0MTFxNTItMjQgMTM3LTE1OC01MSA0MC04Ny41IDg0dC00OS41IDc0em0zOTgtOTIwcS0xNSA0Mi0yIDEzMiAxLTcgNy00NCAwLTMgNy00MyAxLTQgNC04LTEtMS0xLTJ0LS41LTEuNS0uNS0xLjVxLTEtMjItMTMtMzYgMCAxLTEgMnYyem0tMTI0IDY2MXExMzUtNTQgMjg0LTgxLTItMS0xMy05LjV0LTE2LTEzLjVxLTc2LTY3LTEyNy0xNzYtMjcgODYtODMgMTk3LTMwIDU2LTQ1IDgzem02NDYtMTZxLTI0LTI0LTE0MC0yNCA3NiAyOCAxMjQgMjggMTQgMCAxOC0xIDAtMS0yLTN6Ii8+PC9zdmc+',
  },
  // archive files
  // icon: file-archive-o
  // url: https://fontawesome.com/v4.7.0/icon/file-archive-o

  {
    extensions: ['zip', 'zipx', 'tar', 'gz', 'bz', 'bzip', 'xz', 'rar', '7z'],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik03NjggMzg0di0xMjhoLTEyOHYxMjhoMTI4em0xMjggMTI4di0xMjhoLTEyOHYxMjhoMTI4em0tMTI4IDEyOHYtMTI4aC0xMjh2MTI4aDEyOHptMTI4IDEyOHYtMTI4aC0xMjh2MTI4aDEyOHptNzAwLTM4OHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTEyOHYxMjhoLTEyOHYtMTI4aC01MTJ2MTUzNmgxMjgwem0tNjI3LTcyMWwxMDcgMzQ5cTggMjcgOCA1MiAwIDgzLTcyLjUgMTM3LjV0LTE4My41IDU0LjUtMTgzLjUtNTQuNS03Mi41LTEzNy41cTAtMjUgOC01MiAyMS02MyAxMjAtMzk2di0xMjhoMTI4djEyOGg3OXEyMiAwIDM5IDEzdDIzIDM0em0tMTQxIDQ2NXE1MyAwIDkwLjUtMTl0MzcuNS00NS0zNy41LTQ1LTkwLjUtMTktOTAuNSAxOS0zNy41IDQ1IDM3LjUgNDUgOTAuNSAxOXoiLz48L3N2Zz4=',
  },
  // audio files
  // icon: file-audio-o
  // url: https://fontawesome.com/v4.7.0/icon/file-audio-o
  {
    extensions: ['mp3', 'wma', 'ogg', 'oga', 'wav', 'flac', 'aac'],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS03ODgtODE0cTIwIDggMjAgMzB2NTQ0cTAgMjItMjAgMzAtOCAyLTEyIDItMTIgMC0yMy05bC0xNjYtMTY3aC0xMzFxLTE0IDAtMjMtOXQtOS0yM3YtMTkycTAtMTQgOS0yM3QyMy05aDEzMWwxNjYtMTY3cTE2LTE1IDM1LTd6bTQxNyA2ODlxMzEgMCA1MC0yNCAxMjktMTU5IDEyOS0zNjN0LTEyOS0zNjNxLTE2LTIxLTQzLTI0dC00NyAxNHEtMjEgMTctMjMuNSA0My41dDE0LjUgNDcuNXExMDAgMTIzIDEwMCAyODJ0LTEwMCAyODJxLTE3IDIxLTE0LjUgNDcuNXQyMy41IDQyLjVxMTggMTUgNDAgMTV6bS0yMTEtMTQ4cTI3IDAgNDctMjAgODctOTMgODctMjE5dC04Ny0yMTlxLTE4LTE5LTQ1LTIwdC00NiAxNy0yMCA0NC41IDE4IDQ2LjVxNTIgNTcgNTIgMTMxdC01MiAxMzFxLTE5IDIwLTE4IDQ2LjV0MjAgNDQuNXEyMCAxNyA0NCAxN3oiLz48L3N2Zz4=',
  },
  // video files
  // icon: file-video-o
  // url: https://fontawesome.com/v4.7.0/icon/file-video-o
  {
    extensions: [
      'mp4',
      'm4p',
      'm4v',
      'mpg',
      'mp2',
      'mpeg',
      'mpe',
      'mpv',
      'm2v',
      'avi',
      'mkv',
      'flv',
      'ogv',
      'mov',
      '3gp',
      '3g2',
    ],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS02NDAtODk2cTUyIDAgOTAgMzh0MzggOTB2Mzg0cTAgNTItMzggOTB0LTkwIDM4aC0zODRxLTUyIDAtOTAtMzh0LTM4LTkwdi0zODRxMC01MiAzOC05MHQ5MC0zOGgzODR6bTQ5MiAycTIwIDggMjAgMzB2NTc2cTAgMjItMjAgMzAtOCAyLTEyIDItMTQgMC0yMy05bC0yNjUtMjY2di05MGwyNjUtMjY2cTktOSAyMy05IDQgMCAxMiAyeiIvPjwvc3ZnPg==',
  },
  // word files
  // icon: file-word-o
  // url: https://fontawesome.com/v4.7.0/icon/file-word-o
  {
    extensions: ['doc', 'dot', 'docx', 'docm', 'dotx', 'dotm', 'docb'],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS0xMTc1LTg5NnYxMDdoNzBsMTY0IDY2MWgxNTlsMTI4LTQ4NXE3LTIwIDEwLTQ2IDItMTYgMi0yNGg0bDMgMjRxMSAzIDMuNSAyMHQ1LjUgMjZsMTI4IDQ4NWgxNTlsMTY0LTY2MWg3MHYtMTA3aC0zMDB2MTA3aDkwbC05OSA0MzhxLTUgMjAtNyA0NmwtMiAyMWgtNGwtMy0yMXEtMS01LTQtMjF0LTUtMjVsLTE0NC01NDVoLTExNGwtMTQ0IDU0NXEtMiA5LTQuNSAyNC41dC0zLjUgMjEuNWwtNCAyMWgtNGwtMi0yMXEtMi0yNi03LTQ2bC05OS00MzhoOTB2LTEwN2gtMzAweiIvPjwvc3ZnPg==',
  },
  // excel files
  // icon: file-excel-o
  // url: https://fontawesome.com/v4.7.0/icon/file-excel-o
  {
    extensions: [
      'sheet',
      'xls',
      'xlt',
      'xlm',
      'xlsx',
      'xlsm',
      'xltx',
      'xltm',
      'xlsb',
      'xla',
      'xlam',
      'xll',
      'xlw',
    ],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS05NzktMjM0djEwNmgyODF2LTEwNmgtNzVsMTAzLTE2MXE1LTcgMTAtMTYuNXQ3LjUtMTMuNSAzLjUtNGgycTEgNCA1IDEwIDIgNCA0LjUgNy41dDYgOCA2LjUgOC41bDEwNyAxNjFoLTc2djEwNmgyOTF2LTEwNmgtNjhsLTE5Mi0yNzMgMTk1LTI4Mmg2N3YtMTA3aC0yNzl2MTA3aDc0bC0xMDMgMTU5cS00IDctMTAgMTYuNXQtOSAxMy41bC0yIDNoLTJxLTEtNC01LTEwLTYtMTEtMTctMjNsLTEwNi0xNTloNzZ2LTEwN2gtMjkwdjEwN2g2OGwxODkgMjcyLTE5NCAyODNoLTY4eiIvPjwvc3ZnPg==',
  },
  // presentation files
  // icon: file-powerpoint-o
  // url: https://fontawesome.com/v4.7.0/icon/file-powerpoint-o
  {
    extensions: [
      'ppt',
      'pot',
      'pps',
      'pptx',
      'pptm',
      'potx',
      'potm',
      'ppam',
      'ppsx',
      'ppsm',
      'sldx',
      'sldm',
    ],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS05OTItMjM0djEwNmgzMjd2LTEwNmgtOTN2LTE2N2gxMzdxNzYgMCAxMTgtMTUgNjctMjMgMTA2LjUtODd0MzkuNS0xNDZxMC04MS0zNy0xNDF0LTEwMC04N3EtNDgtMTktMTMwLTE5aC0zNjh2MTA3aDkydjU1NWgtOTJ6bTM1My0yODBoLTExOXYtMjY4aDEyMHE1MiAwIDgzIDE4IDU2IDMzIDU2IDExNSAwIDg5LTYyIDEyMC0zMSAxNS03OCAxNXoiLz48L3N2Zz4=',
  },
  // code files including javascriot and css
  // icon: file-code-o
  // url: https://fontawesome.com/v4.7.0/icon/file-code-o
  {
    extensions: [
      'c',
      'cpp',
      'cxx',
      'h',
      'go',
      'py',
      'js',
      'ts',
      'ruby',
      'json',
      'java',
      'swift',
      'vb',
      'cs',
      'pl',
      'html',
      'htm',
    ],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS05MjgtODk2cTgtMTEgMjEtMTIuNXQyNCA2LjVsNTEgMzhxMTEgOCAxMi41IDIxdC02LjUgMjRsLTE4MiAyNDMgMTgyIDI0M3E4IDExIDYuNSAyNHQtMTIuNSAyMWwtNTEgMzhxLTExIDgtMjQgNi41dC0yMS0xMi41bC0yMjYtMzAxcS0xNC0xOSAwLTM4em04MDIgMzAxcTE0IDE5IDAgMzhsLTIyNiAzMDFxLTggMTEtMjEgMTIuNXQtMjQtNi41bC01MS0zOHEtMTEtOC0xMi41LTIxdDYuNS0yNGwxODItMjQzLTE4Mi0yNDNxLTgtMTEtNi41LTI0dDEyLjUtMjFsNTEtMzhxMTEtOCAyNC02LjV0MjEgMTIuNXptLTYyMCA0NjFxLTEzLTItMjAuNS0xM3QtNS41LTI0bDEzOC04MzFxMi0xMyAxMy0yMC41dDI0LTUuNWw2MyAxMHExMyAyIDIwLjUgMTN0NS41IDI0bC0xMzggODMxcS0yIDEzLTEzIDIwLjV0LTI0IDUuNXoiLz48L3N2Zz4=',
  },
  // Text files including markdown and txt
  // icon: file-text
  // url: https://fontawesome.com/v4.7.0/icon/file-text
  {
    extensions: [
      'md',
      'markdown',
      'mdown',
      'mkdn',
      'mkd',
      'mdwn',
      'mdtxt',
      'mdtext',
      'txt',
      'text',
    ],
    imageData:
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6bS0xMDI0LTg2NHEwLTE0IDktMjN0MjMtOWg3MDRxMTQgMCAyMyA5dDkgMjN2NjRxMCAxNC05IDIzdC0yMyA5aC03MDRxLTE0IDAtMjMtOXQtOS0yM3YtNjR6bTczNiAyMjRxMTQgMCAyMyA5dDkgMjN2NjRxMCAxNC05IDIzdC0yMyA5aC03MDRxLTE0IDAtMjMtOXQtOS0yM3YtNjRxMC0xNCA5LTIzdDIzLTloNzA0em0wIDI1NnExNCAwIDIzIDl0OSAyM3Y2NHEwIDE0LTkgMjN0LTIzIDloLTcwNHEtMTQgMC0yMy05dC05LTIzdi02NHEwLTE0IDktMjN0MjMtOWg3MDR6Ii8+PC9zdmc+',
  },
];

// unique files extension including file with no extension
// icon: file-o
// url: https://fontawesome.com/v4.7.0/icon/file-o
function getDefaultImageData() {
  return 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6Ii8+PC9zdmc+';
}

function getImageData(file) {
  const ext = file.name.split('.').pop();
  const icon = icons.filter((item) => {
    return item.extensions.includes(ext);
  });
  if (icon.length > 0) {
    return icon[0].imageData;
  } else {
    return getDefaultImageData();
  }
}

module.exports = {
  getImageData,
};
