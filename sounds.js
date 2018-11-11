$(document).ready(function () {

    var $hadoukenSound = $("#hadouken");

    $(".character > .image").on('mouseenter', function () {
        $hadoukenSound.get(0).play();
    });

    $(".character > .image").on('mouseout', function () {
        $hadoukenSound.get(0).pause();
        $hadoukenSound.get(0).currentTime = 0;
    });

    var $enemySound = $('#enemySound');

    $(".enemy > .image").on('mouseenter', function () {
        $enemySound.get(0).play();
    });

    $(".enemy > .image").on('mouseout', function () {
        $enemySound.get(0).pause();
        $enemySound.get(0).currentTime = 0;
    });

});