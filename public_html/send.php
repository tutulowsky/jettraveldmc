<?php
/**
 * Jet Travel DMC – contact form handler (replaces Gravity Forms).
 * Sends the /contact/ form by e-mail using PHP mail() on cPanel.
 */

// ---- Settings ---------------------------------------------------------------
$TO        = 'info@jettraveldmc.com';          // recipient
$FROM      = 'noreply@jettraveldmc.com';       // must be an address on this domain
$SUBJECT   = 'New inquiry from jettraveldmc.com';
$BACK      = '/contact/';
$RATE_SECS = 30;                               // min. seconds between two sends per IP
// -----------------------------------------------------------------------------

header('X-Robots-Tag: noindex');

function back($ok) {
    global $BACK;
    header('Location: ' . $BACK . '?sent=' . ($ok ? '1' : '0') . '#gform_wrapper_1', true, 303);
    exit;
}

function field($name, $max = 200) {
    $v = isset($_POST[$name]) ? (string) $_POST[$name] : '';
    $v = trim(str_replace(["\r", "\0"], '', $v));
    return mb_substr($v, 0, $max, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . $BACK, true, 303);
    exit;
}

// PHP turns "input_1.3" into "input_1_3" in $_POST.
$honeypot = field('input_14');
$token    = field('js_token', 40);

// Spam checks: honeypot must be empty, JS token must exist and be >3s old.
if ($honeypot !== '' || !preg_match('/^jt-(\d{13})$/', $token, $m)) {
    back(true); // pretend success for bots
}
$age = time() - intdiv((int) $m[1], 1000);
if ($age < 3 || $age > 86400) {
    back(true);
}

// Simple per-IP rate limit (file based, no database).
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'x';
$lock = sys_get_temp_dir() . '/jt_form_' . md5($ip);
if (is_file($lock) && (time() - filemtime($lock)) < $RATE_SECS) {
    back(false);
}

$data = [
    'Last name'            => field('input_1_3'),
    'First name'           => field('input_1_6'),
    'Phone'                => field('input_4', 50),
    'Email'                => field('input_2', 150),
    'Type of inquiry'      => field('input_11', 50),
    'Arrival date'         => field('input_5', 20),
    'Departure date'       => field('input_6', 20),
    'Number of guests'     => field('input_12', 20),
    'Catering'             => field('input_7', 50),
    'Accommodation'        => field('input_9', 50),
    'Newsletter'           => field('input_10_1', 5) === '1' ? 'Yes' : 'No',
];
$comments = isset($_POST['input_3']) ? mb_substr(trim(str_replace("\0", '', (string) $_POST['input_3'])), 0, 600, 'UTF-8') : '';
$email2   = field('input_2_2', 150);

if ($data['Last name'] === '' || $data['First name'] === ''
    || !filter_var($data['Email'], FILTER_VALIDATE_EMAIL)
    || strcasecmp($data['Email'], $email2) !== 0) {
    back(false);
}

$body = "New inquiry from the website contact form:\n\n";
foreach ($data as $k => $v) {
    $body .= str_pad($k . ':', 20) . ($v === '' ? '-' : $v) . "\n";
}
$body .= "\nComments:\n" . ($comments === '' ? '-' : $comments) . "\n";
$body .= "\n--\nIP: " . $ip . "\nTime: " . date('Y-m-d H:i:s') . "\n";

$headers = [
    'From: Jet Travel DMC website <' . $FROM . '>',
    'Reply-To: ' . $data['Email'],   // validated above, no header injection possible
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
$subject = '=?UTF-8?B?' . base64_encode($SUBJECT . ' – ' . $data['First name'] . ' ' . $data['Last name']) . '?=';

$ok = mail($TO, $subject, $body, implode("\r\n", $headers), '-f' . $FROM);
if ($ok) {
    @touch($lock);
}
back($ok);
