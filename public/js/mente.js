$(function() {

  var database = firebase.database();

  let room = "chat_room";
  const message = document.getElementById("message");
  const output = document.getElementById("output");

  //送信処理
  $(document).on('click', '#send', function() {
    var now = new Date();
    database.ref(room).push({
        name: $('#name').val(),
        message: message.value,
        date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
    });
    message.value="";
  });

  //受信処理
  database.ref(room).on("child_added", function(data) {
    const v = data.val();
    const k = data.key;
    let str = "";
    str += '<div class="name">名前：'+v.name+'</div>';
    str += '<div class="text">日時：'+v.date+'</div>';
    str += '<div class="text">メッセージ：'+v.message+'</div><hr>';
    output.innerHTML += str;
  });


  // let change = "change_room";
  // const idd = document.getElementById("idd");
  // const names = document.getElementById("names");
  // const items = document.getElementById("items");
  // const places = document.getElementById("places");
  // const attr = document.getElementById("attr");

  // $('#it').on('click', function() {
  //     var now = new Date();
  //     database.ref(change).push({
  //       id: idd.value,
  //       name: names.value,
  //       item: items.value,
  //       place: places.value,
  //       completed: true,
  //       date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //     });
  //   });

  // let check = "check_room";
  // $('#it').on('click', function() {
  //   var now = new Date();
  //   database.ref(check).push({
  //     id: idd.value,
  //     name: items.value,
  //     attribute: attr.value,
  //     userId: 0,
  //     date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //   });
  // });

  // let allCards = "card_room";
  // $('#it').on('click', function() {
  //   var now = new Date();
  //   database.ref(allCards).push({
  //     id: idd.value,
  //     name: items.value,
  //     attribute: attr.value,
  //     userId: 0,
  //     completed: true,
  //     date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //   });
  // });

  // 人補充
  // let item = "person_room";
  // const idd = document.getElementById("idd");
  // const items = document.getElementById("items");
  // $('#it').on('click', function() {
  //   var now = new Date();
  //   database.ref(item).push({
  //     id: idd.value,
  //     name: items.value,
  //     userId: 0,
  //     completed: true,
  //     date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //   });
  // });

  // 武器補充
  // let item = "item_room";
  // const idd = document.getElementById("idd");
  // const items = document.getElementById("items");
  // $('#it').on('click', function() {
  //   var now = new Date();
  //   database.ref(item).push({
  //     id: idd.value,
  //     name: items.value,
  //     userId: 0,
  //     completed: true,
  //     date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //   });
  // });

  // 場所補充
  // let item = "place_room";
  // const idd = document.getElementById("idd");
  // const items = document.getElementById("items");
  // $('#it').on('click', function() {
  //   var now = new Date();
  //   database.ref(item).push({
  //     id: idd.value,
  //     name: items.value,
  //     userId: 0,
  //     completed: true,
  //     date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分',
  //   });
  // });

//   <!-- <section>
//   <input type="text" id="idd">
//   <input type="text" id="items">
//   <button id="it">GO</button>
// </section> -->

// <!-- <section>
//   <input type="text" id="idd">
//   <input type="text" id="items">
//   <input type="text" id="attr">
//   <button id="it">GO</button>
// </section> -->

// <!-- <section>
//   <input type="text" id="idd">
//   <input type="text" id="names">
//   <input type="text" id="items">
//   <input type="text" id="places">
//   <button id="it">GO</button>
// </section> -->

});
