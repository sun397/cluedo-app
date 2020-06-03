$(function() {
  var database = firebase.database();
  let user = "user_room";
  let item = "item_room";
  let person = "person_room";
  let place = "place_room";
  let change = "change_room";
  let check = "check_room";
  let chat = "chat_room";


  // チェックリスト表示
  var radio = '<td><input type="text" size="5"></td><td><input type="text" size="5"></td><td><input type="text" size="5"></td><td><input type="text" size="5"></td>';
  var personList = ['アイアンマン', 'キャプテンアメリカ', 'ソー', 'スパイダーマン', 'ハルク', 'ブラックパンサー'];
  var itemList = ['剣', '斧', '弓', '棒', 'ラケット', 'フライパン'];
  var placeList = ['富士山', '隅田川', '渋谷', '地獄', '城下町', '別荘', '寝室', 'ハワイ', 'スラム街'];
  database.ref(user).on("value", function(data) {
    let list = '';
    data.forEach(function(childData) {
      list += '<th>'+childData.val().name+'</th>';
    });
    $('#person-list').html('<th>アイテム\\ユーザー</th>'+list);
  });
  for (i=1;i<7;i++) {
    $('#person-list'+i).html('<th>'+personList[i-1]+'</th>'+radio);
    $('#item-list'+i).html('<th>'+itemList[i-1]+'</th>'+radio);
    $('#person-reason').append('<option value="'+i+'" name="person">'+personList[i-1]+'</option>');
    $('#item-reason').append('<option value="'+i+'" name="item">'+itemList[i-1]+'</option>');
  };
  for (i=1;i<10;i++) {
    $('#place-list'+i).html('<th>'+placeList[i-1]+'</th>'+radio);
    $('#place-reason').append('<option value="'+i+'" name="place">'+placeList[i-1]+'</option>');
  }

  // ユーザー参加処理
  const id = $('#p-id');
  const userName = $('#user-name');
  $('#submit-go').on('click', function() {
    var now = new Date();
    database.ref(user).push({
      id: Number(id.val()),
      name: userName.val(),
      completed: false,
      date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
    });
    $('#user-name-place').html('<p id="userId" data-userid="'+Number(id.val())+'">'+userName.val()+'</p>');
    $('#test-name').html('<input type="hidden" id="name" value="'+userName.val()+'">');
    $('#submit-go').prop('disabled', true);
    userName.val('');
  });

  // 参加ユーザーリスト表示
  var userCount = 0;
  database.ref(user).on("child_added", function(data) {
    userCount++;
    const v = data.val();
    $('#p-'+v.id).html('<span>'+v.name+'</span>');
    database.ref(user).on("value", function(data) {
      data.forEach(function(childData) {
        if (childData.id <= userCount) {
          $('#p-'+childData.id).html(childData.name);
        }
      });
    });
    if (userCount >= 2) {
      $('#start').prop('disabled', false);
    }
  });

  // ゲーム開始時手札配布処理
  $(document).on('click', '#start', function() {
    var userId = Number($('#userId').data('userid'));
    if (userCount == 2) {
      if (userId == 1) {
        var ranPNum = 2;
        var ranINum = 3;
        var ranPlNum = 4;
      } else if (userId == 2) {
        var ranPNum = 3;
        var ranINum = 2;
        var ranPlNum = 4;
      }
    } else if (userCount == 3) {
      if (userId == 1) {
        var ranPNum = 2;
        var ranINum = 2;
        var ranPlNum = 2;
      } else if (userId == 2) {
        var ranPNum = 1;
        var ranINum = 2;
        var ranPlNum = 3;
      } else if (userId == 3) {
        var ranPNum = 2;
        var ranINum = 1;
        var ranPlNum = 3;
      }
    } else if (userCount == 4) {
      if (userId == 1) {
        var ranPNum = 2;
        var ranINum = 1;
        var ranPlNum = 2;
      } else if (userId == 2) {
        var ranPNum = 1;
        var ranINum = 1;
        var ranPlNum = 2;
      } else if (userId == 3) {
        var ranPNum = 1;
        var ranINum = 1;
        var ranPlNum = 2;
      } else if (userId == 4) {
        var ranPNum = 1;
        var ranINum = 2;
        var ranPlNum = 2;
      }
    }
    var randamNu = Math.floor(Math.random() * ((6+ 1) - 1)) + 1;
    var coun = 0;
    database.ref(person).orderByChild("completed").equalTo(true).on("value", function(data) {
      var obNum = Object.keys(data.val()).length;
      if (obNum == 1) {
        coun++;
      }
      while(coun<ranPNum) {
        data.forEach(function(childData) {
          if (coun>=ranPNum) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamNu) {
            $('#person-card').append('<div class="id hand-card-block-text">'+v.name+'</div>');
            $('#char').append('<img src="/img/person/'+v.id+'.jpg" alt=""></img>');
            coun++;
            database.ref(person).child(childData.key).update({completed: false, userId: userId});
          }
          randamNu = Math.floor(Math.random() * ((6 + 1) - 1)) + 1;
        })
      }
    });

    var randamNum = Math.floor(Math.random() * ((6 + 1) - 1)) + 1;
    var count = 0;
    database.ref(item).orderByChild("completed").equalTo(true).on("value", function(data) {
      var obNum = Object.keys(data.val()).length;
      if (obNum == 1) {
        count++;
      }
      while(count<ranINum) {
        data.forEach(function(childData) {
          if (count>=ranINum) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamNum) {
            $('#item-card').append('<div class="id hand-card-block-text">'+v.name+'</div>');
            $('#item-img').append('<img src="/img/item/'+v.id+'.png" alt=""></img>');
            count++;
            database.ref(item).child(childData.key).update({completed: false, userId: userId});
          }
          randamNum = Math.floor(Math.random() * ((6 + 1) - 1)) + 1;
        })
      }
    });

    var randamN = Math.floor(Math.random() * ((9 + 1) - 1)) + 1;
    var cou = 0;
    database.ref(place).orderByChild("completed").equalTo(true).on("value", function(data) {
      var obNum = Object.keys(data.val()).length;
      if (obNum == 1) {
        cou++;
      }
      while(cou<ranPlNum) {
        data.forEach(function(childData) {
          if (cou>=ranPlNum) {
            return true;
          }
          const v = childData.val();
          if (v.id == randamN) {
            $('#place-card').append('<div class="id hand-card-block-text">'+v.name+'</div>');
            $('#place-img').append('<img src="/img/place/'+v.id+'.png" alt=""></img>');
            cou++;
            database.ref(place).child(childData.key).update({completed: false, userId: userId});
          }
          randamN = Math.floor(Math.random() * ((9 + 1) - 1)) + 1;
        })
      }
    });
    $('#start').prop('disabled', true);
    $('#one-de').prop('disabled', false);
  });

  // 推理処理
  var personId;
  var itemId;
  var placeId;
  $(document).on('click', '#one-de', function() {
    $('#result').fadeIn();
    $('#result').html('');
    var i = Number($('#userId').data('userid'));
    personId = Number($('#person-reason option:selected').val());
    itemId = Number($('#item-reason option:selected').val());
    placeId = Number($('#place-reason option:selected').val());

    i++;
    if (i == userCount + 1) {
      i = 1;
    }
    var deferred = mysteryCheck(i, personId, itemId, placeId);
    deferred.done(function() {
      if ($('#result p').text().length) {
        return true;
      } else {
        i++;
        if (i == userCount + 1) {
          i = 1;
        }
        deferred = mysteryCheck(i, personId, itemId, placeId);
        deferred.done(function() {
          if ($('#result p').text().length) {
            return true;
          } else {
            i++;
            if (i == userCount + 1) {
              i = 1;
            }
            deferred = mysteryCheck(i, personId, itemId, placeId);
            deferred.done(function() {
            });
          }
        });
      }
    }).done(function(){
    });
    document.getElementById("one-de").setAttribute('disabled', '');
  });
  var target = document.getElementById('result');
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // console.log(mutation.target);
    });
  });
  const config = {
    childList: true,
    characterData: true,
    subtree: true
  };
  observer.observe(target, config);

  // 推理チェック関数
  function mysteryCheck(i, personId, itemId, placeId) {
    var deferred = new $.Deferred();
    userId = $('#userId').data('userid');
    database.ref(person).orderByChild("userId").equalTo(i).on("value", function(data) {
      data.forEach(function(childData) {
        v = childData.val();
        if (v.id == personId) {
          $('#result').html('<p id="result-reason">プレイヤー'+v.userId+'が持っています</p>');
          database.ref(check).orderByChild("id").equalTo(1).once("value", function(data) {
            var li = Object.keys(data.val())[0];
            database.ref(check).child(li).update({
              name: personId,
              userId: v.userId,
              sendUser: userId
            });
          });
        }
      });
    });
    database.ref(item).orderByChild("userId").equalTo(i).on("value", function(data) {
      data.forEach(function(childData) {
        v = childData.val();
        if (v.id == itemId) {
          $('#result').html('<p id="result-reason">プレイヤー'+v.userId+'が持っています</p>');
          database.ref(check).orderByChild("id").equalTo(2).once("value", function(data) {
            var li = Object.keys(data.val())[0];
            database.ref(check).child(li).update({
              name: itemId,
              userId: v.userId,
              sendUser: userId
            });
          });
        }
      });
    });
    database.ref(place).orderByChild("userId").equalTo(i).once("value", function(data) {
      data.forEach(function(childData) {
        v = childData.val();
        if (v.id == placeId) {
          $('#result').html('<p id="result-reason">プレイヤー'+v.userId+'が持っています</p>');
          database.ref(check).orderByChild("id").equalTo(3).once("value", function(data) {
            var li = Object.keys(data.val())[0];
            database.ref(check).child(li).update({
              name: placeId,
              userId: v.userId,
              sendUser: userId
            });
          });
        }
      });
    }).then(function () {
      deferred.resolve();
    });
    return deferred;
  };

  // 推理表示
  database.ref(change).on("child_changed", function (data) {
    v = data.val();
    if (v.completed === true) {
      $('#result').fadeIn();
      $('.mystery-result-content-other').fadeIn();
      $('#result').html('<p id="result-reason">プレイヤー'+v.hitUser+'が持っています</p>');

      $('#mysteryPlayer').html('プレイヤー'+v.id+'の推理').attr('value', v.id);
      var name = personList[v.name-1]+'・'+itemList[v.item-1]+'・'+placeList[v.place-1];
      var img = '<img src="/img/person/'+v.name+'.jpg" alt=""></img><img src="/img/item/'+v.item+'.png" alt=""></img><img src="/img/place/'+v.place+'.png" alt=""></img>';
      $('#mysteryItem').html(name);
      $('.mystery-result-content-other-img').html(img);
    } else if (v.endCompleted === true) {
      $('#result').fadeIn();
      $('.mystery-result-content-other').fadeIn();
      $('#result').html('<p id="result-reason">他プレイヤーは持っていいません。</p>');

      $('#mysteryPlayer').html('プレイヤー'+v.id+'の推理').attr('value', v.id);
      var name = personList[v.name-1]+'・'+itemList[v.item-1]+'・'+placeList[v.place-1];
      var img = '<img src="/img/person/'+v.name+'.jpg" alt=""></img><img src="/img/item/'+v.item+'.png" alt=""></img><img src="/img/place/'+v.place+'.png" alt=""></img>';
      $('#mysteryItem').html(name);
      $('.mystery-result-content-other-img').html(img);
    }
  });

  // プレイヤーの選んだ、持っているカード表示
  var list = '';
  database.ref(check).on("child_changed", function (data) {
    userId = $('#userId').data('userid');
    v = data.val();
    list = '';
    if (v['userId'] == userId && v['sendUser'] !== userId) {
      $('.mystery-result-content-select').fadeIn();
      if (v['attribute'] == 'person') {
        $('#showp').html('');
        list += '<div class="show-data-person" id="showCard" data-show="'+v.sendUser+'" data-show-attr="person">'+personList[v.name-1]+'</div>';
        $('#showp').html(list);
      } else if (v['attribute'] == 'item') {
        $('#showi').html('');
        list += '<div class="show-data-item" id="showCard" data-show="'+v.sendUser+'" data-show-attr="item">'+itemList[v.name-1]+'</div>';
        $('#showi').html(list);
      } else if (v['attribute'] == 'place') {
        $('#showpl').html('');
        list += '<div class="show-data-place" id="showCard" data-show="'+v.sendUser+'" data-show-attr="place">'+placeList[v.name-1]+'</div>';
        $('#showpl').html(list);
      }
    }

    if (v['sendUser'] == userId) {
      if (v['sendUser'] == v['userId']) {
        database.ref(change).once("value", function(data) {
          data.forEach(function(childData) {
            database.ref(change).child(childData.key).update({
              id: Number(userId),
              name: personId,
              item: itemId,
              place: placeId,
              hitUser: v.userId,
              endCompleted: true,
            });
          });
        });
      } else {
        database.ref(change).once("value", function(data) {
          data.forEach(function(childData) {
            database.ref(change).child(childData.key).update({
              id: Number(userId),
              name: personId,
              item: itemId,
              place: placeId,
              hitUser: v.userId,
              completed: true,
            });
          });
        });
      }
    }

    // 選択されたカードを取得
    if (v['sendUser'] == userId && v['completed'] == true) {
      if (v['attribute'] == 'person') {
        $('#result').html('<p id="result-reason">'+personList[v.name-1]+'</p>');
      } else if (v['attribute'] == 'item') {
        $('#result').html('<p id="result-reason">'+itemList[v.name-1]+'</p>');
      } else if (v['attribute'] == 'place') {
        $('#result').html('<p id="result-reason">'+placeList[v.name-1]+'</p>');
      }
    }
  });
  // プレイヤーのカード選択処理
  $(document).on('click', '#showCard', function () {
    userId = document.getElementById('userId').getAttribute('data-userid');
    var attr = $(this).data()['showAttr'];
    database.ref(check).orderByChild("attribute").equalTo(attr).once("value", function(data) {
      var li = Object.keys(data.val())[0];
      database.ref(check).child(li).update({completed: true});
    });
    $('.mystery-result-content-select').fadeOut();
  });

  // 自分のターンチェック処理
  database.ref(user).on("child_changed", function (data) {
    $('#showp').html('');
    $('#showi').html('');
    $('#showpl').html('');
    var v = data.val();
    var authId = document.getElementById('userId').getAttribute('data-userid');
    if (v.completed == true) {
      $('.is_color').removeClass('color');
      $('#p-'+v.id).addClass('color');
      $('.join-now-turn-p').html('<p>プレイヤー'+v.id+'のターン</p>')
      document.getElementById("one-de").setAttribute('disabled', '');
      document.getElementById("turn-end").setAttribute('disabled', '');
      if (v.id == authId) {
        document.getElementById("one-de").removeAttribute('disabled');
        document.getElementById("turn-end").removeAttribute('disabled');
      }
    } else {
      return true;
    }
    $('#result').fadeOut();
    $('.mystery-result-content-other').fadeOut();
  });

  // ターン終了処理
  $(document).on('click', '#turn-end', function() {
    var userId = document.getElementById('userId').getAttribute('data-userid');
    var nextUser = userId++;
    if (userId == userCount+1) {
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
    database.ref(check).once("value", function(data) {
      data.forEach(function(childData) {
        database.ref(check).child(childData.key).update({
          name: 0,
          userId: 0,
          sendUser: 0,
          completed: false,
        });
      });
    });
    database.ref(change).once("value", function(data) {
      data.forEach(function(childData) {
        database.ref(change).child(childData.key).update({
          id: 0,
          name: 0,
          item: 0,
          place: 0,
          hitUser: 0,
          completed: false,
          endCompleted: false,
        });
      });
    });
    document.getElementById("turn-end").setAttribute('disabled', '');
  });


  // ゲームリセット
  $('#reset').on('click', function() {
    // for (var i = 0; i <3 ; i++) {
    //   var resetList = [item, person, place];
    //   database.ref(resetList[i]).on("value", function(data) {
    //     data.forEach(function(childData) {
    //       console.log(childData);
    //       database.ref(resetList[i]).child(childData.key).update({completed: true, userId: 0});
    //     });
    //   });
    // }
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
    database.ref(change).on("value", function(data) {
      data.forEach(function(childData) {
        database.ref(change).child(childData.key).update({
          id: 0,
          name: 0,
          item: 0,
          place: 0,
          hitUser: 0,
          completed: false,
          endCompleted: false,
        });
      });
    });
    database.ref(check).on("value", function(data) {
      data.forEach(function(childData) {
        database.ref(check).child(childData.key).update({
          name: 0,
          userId: 0,
          sendUser: 0,
          completed: false
        });
      });
    })
    database.ref(user).remove();
    database.ref(chat).remove();
  });
});