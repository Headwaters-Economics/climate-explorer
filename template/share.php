<?php
$share_title = isset($share_data['title']) ? $purifier->purify($share_data['title']) : 'Climate Explorer';
$share_url = isset($share_data['url']) ? $purifier->purify($share_data['url']) : current_URL();
$tweet_text = $share_title . ' via @NOAA Climate Explorer: ' . $share_url;
?>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="share-widget">
  <a href="#" class="share-trigger"><span class="icon icon-social"></span>Share</a>
  <ul>
    <li><a href="#" class="share-link share-facebook" data-href="<?php echo $share_url; ?>"><span class="icon icon-facebook"></span>Facebook</a></li>
    <li><a href="https://twitter.com/intent/tweet?text=<?php echo urlencode($tweet_text); ?>" class="share-link share-twitter"><span class="icon icon-twitter"></span>Twitter</a></li>
    <li id="share-permalink"><a href="#" class="share-link share-permalink"><span class="icon icon-link"></span>Copy Permalink</a></li>
    <!--<li><a href="#" class="share-link share-linkedin"><span class="icon icon-linkedin"></span>LinkedIn</a></li>-->
  </ul>
  
  <div id="share-permalink-input">
    <input type="text" value="<?php echo current_URL(); ?>">
  </div>
</div>
