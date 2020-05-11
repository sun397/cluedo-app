$(function() {

  var database = firebase.database();
  let user = "user_room";
  let item = "item_room";
  let person = "person_room";
  let place = "place_room";

  // チェックリスト表示
  var radio = '<td><input type="radio"></td><td><input type="radio"></td><td><input type="radio"></td><td><input type="radio"></td>';
  var personList = ['スライム', 'トルネコ', 'エスターク', 'メタルキング'];
  var itemList = ['剣', '斧', '弓', '棒'];
  var placeList = ['山', '川', '家', '地獄'];

  database.ref(user).on("value", function(data) {
    let list = '';
    data.forEach(function(childData) {
      list += '<th>'+childData.val().name+'</th>';
    });
    $('#person-list').html('<th>アイテム\\ユーザー</th>'+list);
  });
  for (i=1;i<5;i++) {
    $('#person-list'+i).html('<th>'+personList[i-1]+'</th>'+radio);
    $('#item-list'+i).html('<th>'+itemList[i-1]+'</th>'+radio);
    $('#place-list'+i).html('<th>'+placeList[i-1]+'</th>'+radio);
    $('#person-reason').append('<option value="'+i+'" name="person">'+personList[i-1]+'</option>');
    $('#item-reason').append('<option value="'+i+'" name="item">'+itemList[i-1]+'</option>');
    $('#place-reason').append('<option value="'+i+'" name="place">'+placeList[i-1]+'</option>');
  };

  // ユーザー参加
  const id = document.getElementById("p-id");
  const userName = document.getElementById("user-name");
  $('#submit-go').on('click', function() {
    var now = new Date();
    database.ref(user).push({
      id: Number(id.value),
      name: userName.value,
      completed: false,
      date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
    });
    $('#user-name-place').html('<p id="userId" data-userid="'+Number(id.value)+'">'+userName.value+'</p>');
    document.getElementById("submit-go").setAttribute('disabled', '');
    document.getElementById("one-de").removeAttribute('disabled');
    $('#name').html('名前'+userName.value+'<input type="hidden" id="name" value="'+userName.value+'">');
    userName.value="";
  });

  // 参加ユーザーリスト
  database.ref(user).on("child_added", function(data) {
    const v = data.val();
    $('#p-'+v.id).html('<span>'+v.name+'</span>');
    database.ref(user).on("value", function(data) {
      data.forEach(function(childData) {
        if (childData.id <= 4) {
          $('#p-'+childData.id).html(childData.name);
        }
      });
    });
  });

  // ゲーム開始時手札配布
  $(document).on('click', '#start', function() {
    var randamNum = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
    var count = 0;
    var userId = Number(document.getElementById('userId').getAttribute('data-userid'));
    database.ref(item).orderByChild("completed").equalTo(true).on("value", function(data) {
      let str = "";
      while(count<1) {
        data.forEach(function(childData) {
          if (count>=1) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamNum) {
            $('#item-card').append('<div class="id">武器:'+v.name+'</div>');
            count++;
            database.ref(item).child(childData.key).update({completed: false, userId: userId});
          }
          randamNum = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
        })
      }
    });

    var randamNu = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
    var coun = 0;
    database.ref(person).orderByChild("completed").equalTo(true).on("value", function(data) {
      let str = "";
      while(coun<1) {
        data.forEach(function(childData) {
          if (coun>=1) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamNu) {
            $('#person-card').append('<div class="id">人:'+v.name+'</div>');
            coun++;
            database.ref(person).child(childData.key).update({completed: false, userId: userId});
          }
          randamNu = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
        })
      }
    });

    var randamN = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
    var cou = 0;
    database.ref(place).orderByChild("completed").equalTo(true).on("value", function(data) {
      let str = "";
      while(cou<1) {
        data.forEach(function(childData) {
          if (cou>=1) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamN) {
            $('#place-card').append('<div class="id">場所:'+v.name+'</div>');
            cou++;
            database.ref(place).child(childData.key).update({completed: false, userId: userId});
          }
          randamN = Math.floor(Math.random() * ((4 + 1) - 1)) + 1;
        })
      }
    });
    document.getElementById("start").setAttribute('disabled', '');
  });

  // 推理
  var count = 0;
  $(document).on('click', '#one-de', function() {
    var userId = document.getElementById('userId').getAttribute('data-userid');
    var i = Number(userId);

    while (count < 2) {
      if (i + 1 == 5) {
        i = 1;
      }
      if (i == userId) {
        i++;
        continue;
      }
      var personId = Number($('#person-reason option:selected').val());
      database.ref(person).orderByChild("userId").equalTo(i).once("value", function(data) {
        data.forEach(function(childData) {
          v = childData.val();
          if (v.id == personId) {
            $('#result').append('<p id="result-reason">プレイヤー'+v.userId+v.name+'</p>');
            return true;
          }
        });
      });
      var itemId = Number($('#item-reason option:selected').val());
      database.ref(item).orderByChild("userId").equalTo(i).once("value", function(data) {
        data.forEach(function(childData) {
          v = childData.val();
          if (v.id == itemId) {
            $('#result').append('<p id="result-reason">プレイヤー'+v.userId+v.name+'</p>');
            return true;
          }
        });
      });
      var placeId = Number($('#place-reason option:selected').val());
      database.ref(place).orderByChild("userId").equalTo(i).once("value", function(data) {
        data.forEach(function(childData) {
          v = childData.val();
          if (v.id == placeId) {
            $('#result').append('<p id="result-reason">プレイヤー'+v.userId+v.name+'</p>');
            return true;
          }
        });
      });
      i++;
      count++;
    }
    document.getElementById("one-de").setAttribute('disabled', '');
  });
  var target = document.getElementById('result');
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // var count = target.childElementCount;
      count = 2;
      $('#result p').eq(1).remove();
      console.log(mutation.target);
    });
  });
  const config = {
    childList: true,
    characterData: true,
    subtree: true
  };
  observer.observe(target, config);

  // ターン終了
  $(document).on('click', '#turn-end', function() {
    var userId = document.getElementById('userId').getAttribute('data-userid');
    var nextUser = userId++;
    if (userId == 4) {
      userId = 1;
    }
    database.ref(user).once("value", function(data) {
      data.forEach(function(childData) {
        v = childData.val();
        if (v.id == userId) {
          database.ref(user).child(childData.key).update({completed: true});
        } else if (v.id == nextUser) {
          database.ref(user).child(childData.key).update({completed: false});
        }
      });
    });
    document.getElementById("turn-end").setAttribute('disabled', '');
  });

  // 自分のターンチェック
  database.ref(user).on("child_changed", function() {
    var authId = document.getElementById('userId').getAttribute('data-userid');
    database.ref(user).once("value", function(data) {
      data.forEach(function(childData) {
        v = childData.val();
        if (v.completed == true) {
          $('#p-'+v.id).addClass('color');
        } else {
          console.log(v);
          $('#p-'+v.id).removeClass('color');
        }
        if (v.id == authId && v.completed == true) {
          document.getElementById("one-de").removeAttribute('disabled');
          document.getElementById("turn-end").removeAttribute('disabled');
          return true;
        } else {
          document.getElementById("one-de").setAttribute('disabled', '');
          document.getElementById("turn-end").setAttribute('disabled', '');
        }
      });
    });
  });

  // ゲームリセット
  $('#reset').on('click', function() {
    database.ref(item).on("value", function(data) {
      data.forEach(function(childData) {
        database.ref(item).child(childData.key).update({completed: true, userId: 0});
      });
    });
    database.ref(person).on("value", function(data) {
      data.forEach(function(childData) {
        database.ref(person).child(childData.key).update({completed: true, userId: 0});
      });
    });
    database.ref(place).on("value", function(data) {
      data.forEach(function(childData) {
        database.ref(place).child(childData.key).update({completed: true, userId: 0});
      });
    });
    database.ref(user).remove();
  });

});
