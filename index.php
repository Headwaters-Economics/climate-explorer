<!doctype html>
<html>
<head>


  <?php include_once('template/head.php') ?>

  <meta property="fb:app_id" content="187816851587993">
  <meta property="og:url" content="/">
  <meta property="og:type" content="article">
  <meta property="og:title" content="Climate Explorer">
  <meta property="og:description" content="The Climate Explorer allows you to view historical and projected climate variables and assess the impacts of climate change on the things you care about">
  <meta property="og:image" content="/resources/img/og.jpg">

</head>
<body id="page-home" class="">
<div class="cd-cover-layer"></div>
<?php include_once('template/header.php'); ?>

<div id="viewport">
  <div id="main-content-wrap">
    <section id="home-splash">
      <div id="splash-6" class="splash-bg"></div>

      <div id="home-text" class="splash-text">
        <h1>The Climate Explorer</h1>
        <p>Explore graphs and maps of historical and projected climate variables for any county in the contiguous United States.</p>
      </div>

      <ul id="home-menu" class="menu blue-menu">
        <li><a href="/#" class="launch-nav" data-nav-slide="0" id="home-search-by-location"><span class="icon icon-search"></span>Select a location</a></li>
        <li><a href="/#" class="launch-nav" data-nav-slide="1" id="home-search-by-variable"><span class="icon icon-variables"></span>View by variable</a></li>
        <li class="border"><a href="/#" class="launch-nav" data-nav-slide="2" id="home-search-by-station"><span class="icon icon-bubble"></span>Weather & Tidal Stations</a></li>
        <li><a href="/#" id="cd-tour-trigger" class="start-home-tour"><span class="icon icon-tour"></span>New here? Take the tour</a></li>
      </ul>

      <div id="h7">
        <a href="http://habitatseven.com" target="_blank"><span class="logo"></span><span class="text">Designed by Habitat Seven</span></a>
      </div>

      <div id="logos">
        <a><img src="/resources/img/logo_noaa.png"></a>
        <a><img src="/resources/img/logo_nasa.png"></a>
        <a><img src="/resources/img/logo_usgs.png"></a>
        <a><img src="/resources/img/logo_epa.png"></a>
        <a><img src="/resources/img/logo_usdi.png"></a>
        <a><img src="/resources/img/logo_nemac.png"></a>
        <a id="global-change"><img src="/resources/img/logo_global-change.png"></a>
      </div>
    </section>

  </div>

  <?php include_once('template/share.php'); ?>
</div>

<?php include_once('template/footer.php'); ?>

</body>
</html>
