import Mock from 'mockjs';

const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

export function scoreList(num = 10) {
  let data = [];
  for (let i = 0; i < num; i++) {
    let template = {
      'stageId': Random.integer(1, 100),
      'stageTitle': Random.cparagraph(1),
      'score': Random.integer(1, 100),
      'scoreRank': Random.integer(1, 100),
      'day': Random.date()
    }
    data.push(template)
  }

  return Mock.mock(data);
}

export function examPaperList() {
  let data = [];
  for (let i = 0; i < 20; i++) {
    let template = {
      'paperId': Random.integer(1, 100),
      'stageTitle': Random.csentence(5, 20),
      'title': Random.ctitle(5, 20),
      'image': Random.image('200x100'),
      'schoolName': Random.ctitle(5, 10),
    }
    data.push(template)
  }

  return Mock.mock(data);
}


export function lessonList() {
  let data = [];
  for (let i = 0; i < 8; i++) {
    let template = {
      lessonId: Random.integer(1, 100),
      title: Random.ctitle(1, 4),
      startCount: Random.integer(1, 5),
      scoreRank: Random.integer(1, 100),
    }
    data.push(template);
  }
  return Mock.mock(data);
}


export function remarkList(num = 10) {
  let data = [];
  for (let i = 0; i < num; i++) {
    let template = {
      remarkType: Random.integer(0, 1),
      textContent: Random.csentence(12, 150),
      postTime: Random.datetime(),
    }
    data.push(template);
  }
  return Mock.mock(data);
}

export function examPaperComment(num = 20) {
  let data = [];
  for (let i = 0; i < num; i++) {
    let template = {
      commentId: Random.integer(1, 100),
      textContent: Random.csentence(2, 30),
      name: Random.ctitle(2, 4),
      photo: Random.image('50x50'),
      postTime: Random.datetime(),
    }
    data.push(template);
  }
  return Mock.mock(data);
}


export function wisdomList(num = 5) {
  let data = [];
  for (let i = 0; i < num; i++) {
    let template = {
      title: Random.ctitle(5, 25),
      desc: Random.csentence(5, 50),
      photo: Random.image('50x50'),
    }
    data.push(template);
  }
  return Mock.mock(data);
}
