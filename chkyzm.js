function chkyzm(obj) {
  if (obj.value != '') {
    var s = md5(
      md5(obj.value.toUpperCase()).substring(0, 30).toUpperCase() + '10577'
    ).substring(0, 30).toUpperCase();
    document.all.fgfggfdgtyuuyyuuckjg.value = s;
  } else {
    document.all.fgfggfdgtyuuyyuuckjg.value = obj.value.toUpperCase();
  }
}