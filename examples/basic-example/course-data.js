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
      "id":1,
      "name":"Module 1",
      "status":"started",
      "unlockDate":null,
      "prereqs":null,
      "requirement":"all",
      "sequential":false,
      "items":[
        {
          "id":1,
          "title":"Module 1 Item 1",
          "type":"Assignment",
          "indent":0,
          "locked":false,
          "completed":true,
          "pointsPossible":0,
          "requirement":"must_submit",
          "dueAt":"2017-02-06T15:07:00Z",
          "unlockAt":"2017-02-05T15:07:00Z",
          "lockAt":"2017-02-18T15:07:00Z",
          "submissionTypes":"online_text_entry,online_upload",
          "content":"<p>Hi</p>",
        },
        {
          "id":2,
          "title":"Module 1 Item 2",
          "type":"Quizzes::Quiz",
          "indent":1,
          "locked":false,
          "completed":true,
          "pointsPossible":5,
          "requirement":"min_score",
          "requiredPoints":4.0,
          "dueAt":"2017-02-06T15:07:00Z",
          "unlockAt":"2017-02-05T15:07:00Z",
          "lockAt":"2017-02-18T15:07:00Z",
          "questionCount":5,
          "content":"<p>Hi</p>",
        },
        {
          "id":5,
          "title":"Module 1 Item 3",
          "type":"ExternalUrl",
          "indent":5,
          "locked":false,
          "completed":true,
          "requirement":"must_view",
          "content":"www.google.com",
        },
        {
          "id":9,
          "title":"Module 1 Item 4",
          "type":"Attachment",
          "indent":0,
          "locked":false,
          "completed":true,
          "requirement":"must_view",
          "content":"content-package-name-date/viewer/files/file 1.jpg"
        },
        {
          "id":10,
          "title":"Module 1 Item 5",
          "type":"WikiPage",
          "indent":0,
          "locked":false,
          "completed":false,
          "requirement":"must_contribute",
          "content":"<p>YoYo</p>"
        },
        {
          "id":3,
          "title":"Module 2 Item 1",
          "type":"DiscussionTopic",
          "indent":0,
          "locked":false,
          "pointsPossible":null,
          "requirement":"must_contribute",
          "content":"<p>Hi</p>",
        },
      ],
    },
    {
      "id":2,
      "name":"Module 2",
      "status":"locked",
      "unlockDate":"2017-05-05T00:00:00Z",
      "prereqs":null,
      "requirement":null,
      "sequential":false,
      "items":[
        {
          "id":4,
          "title":"Module 2 Item 2",
          "type":"ContextModuleSubHeader",
          "indent":0,
          "locked":true,
        },
        {
          "id":6,
          "title":"Module 2 Item 4",
          "type":"ContextExternalTool",
          "indent":0,
          "locked":true,
          "requirement":"must_view",
        },
      ],
    },
    {
      "id":3,
      "name":"Module 3",
      "status":"locked",
      "unlockDate":null,
      "prereqs":[1,2],
      "requirement":"one",
      "sequential":true,
      "items":[
        {
          "id":7,
          "title":"Module 3 Item 1",
          "type":"Attachment",
          "indent":0,
          "locked":true,
          "requirement":"must_view",
        },
        {
          "id":8,
          "title":"Module 3 Item 2",
          "type":"Assignment",
          "indent":0,
          "locked":true,
          "requirement":"must_mark_done",
        },
      ],
    },
  ],
}
