<!DOCTYPE html>
<html lang="en-GB">
<head>
    <title>Display query string</title>
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <h1>Query string</h1>
    <?php 
        $query_string = $_GET;
        if (!empty($query_string)) {
            $query_count = count($query_string);
            echo "<p>The query string has $query_count " . (($query_count > 1) ? 'entries' : 'entry') . '.</p>' . PHP_EOL;
            echo '<dl>';
            foreach ($query_string as $key => $value)
                echo "<dt>$key</dt><dd>$value</dd>";
            echo '</dl>';

        }
        else {
            echo '<p>The query string is empty</p>';

        }
    ?>
</body>
</html>
