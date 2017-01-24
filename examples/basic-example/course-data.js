window.COURSE_DATA = {
  language: 'en',
  lastDownload: 'Nov 22, 2016 at 10:33 AM',
  title: 'Example Course',
  "files":
  [
    {
      "type":"file",
      "name":"test.pdf",
      "size":2931726,
      "files":null
    },
    {
      "type":"file",
      "name":"test.txt",
      "size":2931726,
      "files":null
    },
    {
      "type":"file",
      "name":"test.bin",
      "size":2931726,
      "files":null
    },
    {
      "type":"folder",
      "name":"folder1",
      "size":null,
      "files":
      [
        {
          "type":"folder",
          "name":"folder2",
          "size":null,
          "files":
          [
            {
              "type":"file",
              "name":"test.txt",
              "size":125270,
              "files":null
            }
          ]
        }
      ]
    }
  ],
  "modules":[
    {
      "id":"crazy_string_of_doom",
      "name":"Module 1",
      "locked":false,
      "unlockDate":null,
      "prereq":null,
      "items":[
        {
          "title":"Module 1 Item 1",
          "type":"assignment",
          "completed":true,
          "pointsPossible":10,
          "indent":0,
          "requirement":"submit",
          "requiredPoints":null,
          "description":"<p>Hi</p>",
          "locked":false,
        },
        {
          "title":"Module 1 Item 2",
          "type":"quiz",
          "completed":false,
          "pointsPossible":5,
          "indent":1,
          "requirement":"score",
          "requiredPoints":4,
          "description":"<p>Hi</p>",
          "locked":false,
        },
      ],
    },
    {
      "id":"crazy_string2",
      "name":"Module 2",
      "locked":true,
      "unlockDate":"2017-05-05T00:00:00Z",
      "prereq":null,
      "items":[
        {
          "title":"Module 2 Item 1",
          "type":"discussion",
          "completed":false,
          "pointsPossible":null,
          "indent":0,
          "requiment":"view",
          "requiredPoints":null,
          "description":"<p>Hi</p>",
          "locked":true,
        },
        {
          "title":"Module 2 Item 2",
          "type":"text",
          "completed":null,
          "indent":0,
          "locked":true,
        },
        {
          "title":"Module 2 Item 3",
          "type":"url",
          "completed":false,
          "indent":5,
          "requirement":"view",
          "url":"www.google.com",
          "locked":true,
        },
        {
          "title":"Module 2 Item 4",
          "type":"tool",
          "completed":false,
          "indent":0,
          "requirement":"view",
          "locked":true,
        },
      ],
    },
    {
      "id":"crazy_string3",
      "name":"Module 3",
      "locked":true,
      "unlockeDate":null,
      "prereq":"crazy_string_of_doom",
      "items":[
        {
          "title":"Module 3 Item 1",
          "type":"file",
          "completed":false,
          "indent":0,
          "requirement":"view",
          "file":"dist/viewer/files/file1.jpg",
          "locked":true,
        },
      ],
    },
  ],
}
