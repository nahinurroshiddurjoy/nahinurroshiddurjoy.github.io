<?php
// WARNING: Running arbitrary code from users is EXTREMELY DANGEROUS.
// This script is a simplified example and lacks robust security measures.
// DO NOT use this in a production environment without significant hardening.
// Consider using Docker containers, virtual machines, or specialized sandboxing services.

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$language = $input['language'] ?? '';
$code = $input['code'] ?? '';
$stdin = $input['input'] ?? ''; // Standard input from the user

$response = ['output' => '', 'error' => ''];
$tempDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'online_compiler' . DIRECTORY_SEPARATOR;
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0777, true); // Ensure the temp directory exists
}
$fileExtension = '';
$outputFile = '';
$command = '';
$sourceFile = ''; // Define $sourceFile to avoid notice if no language matches

// Basic input validation (very rudimentary)
if (empty($language) || empty($code)) {
    $response['error'] = 'Language or code cannot be empty.';
    echo json_encode($response);
    exit;
}
// Limit code length (example)
if (strlen($code) > 10000) { // 10KB limit
    $response['error'] = 'Code is too long. Maximum 10000 characters allowed.';
    echo json_encode($response);
    exit;
}


// Create a unique file name to avoid collisions
$uniqueId = uniqid('code_', true);

switch ($language) {
    case 'python':
        $fileExtension = '.py';
        $sourceFile = $tempDir . $uniqueId . $fileExtension;
        file_put_contents($sourceFile, $code);
        $command = 'python3 ' . escapeshellarg($sourceFile) . ' 2>&1';
        break;
    case 'java':
        // Java compilation and execution is more complex.
        // 1. Save as .java file.
        // 2. Compile with javac.
        // 3. Run the .class file.
        // The class name must match the file name. This script attempts to find the public class name.
        $className = 'Main'; // Default
        if (preg_match('/public\s+class\s+([a-zA-Z_][a-zA-Z0-9_]*)/', $code, $matches)) {
            $className = $matches[1];
        }
        $sourceFile = $tempDir . $className . '.java';
        $classFileDir = $tempDir; // Output .class file in the same temp directory
        file_put_contents($sourceFile, $code);
        // Compile:
        $compileCommand = 'javac -d ' . escapeshellarg($classFileDir) . ' ' . escapeshellarg($sourceFile) . ' 2>&1';
        $compileOutput = shell_exec($compileCommand);
        if (!file_exists($classFileDir . DIRECTORY_SEPARATOR . $className . '.class')) {
            $response['error'] = "Compilation failed:\n" . ($compileOutput ?: "No output from compiler. Check class name and code.");
            echo json_encode($response);
            cleanup([$sourceFile]);
            exit;
        }
        // Execute:
        $command = 'java -cp ' . escapeshellarg($classFileDir) . ' ' . escapeshellarg($className) . ' 2>&1';
        break;
    case 'c':
        $fileExtension = '.c';
        $sourceFile = $tempDir . $uniqueId . $fileExtension;
        $outputFile = $tempDir . $uniqueId . '.out';
        file_put_contents($sourceFile, $code);
        $compileCommand = 'gcc ' . escapeshellarg($sourceFile) . ' -o ' . escapeshellarg($outputFile) . ' -lm 2>&1'; // Link math library
        $compileOutput = shell_exec($compileCommand);
        if (!file_exists($outputFile)) {
            $response['error'] = "Compilation failed:\n" . $compileOutput;
            echo json_encode($response);
            cleanup([$sourceFile]);
            exit;
        }
        $command = escapeshellarg($outputFile) . ' 2>&1';
        break;
    case 'cpp':
        $fileExtension = '.cpp';
        $sourceFile = $tempDir . $uniqueId . $fileExtension;
        $outputFile = $tempDir . $uniqueId . '.out';
        file_put_contents($sourceFile, $code);
        $compileCommand = 'g++ ' . escapeshellarg($sourceFile) . ' -o ' . escapeshellarg($outputFile) . ' -lm 2>&1'; // Link math library
        $compileOutput = shell_exec($compileCommand);
        if (!file_exists($outputFile)) {
            $response['error'] = "Compilation failed:\n" . $compileOutput;
            echo json_encode($response);
            cleanup([$sourceFile]);
            exit;
        }
        $command = escapeshellarg($outputFile) . ' 2>&1';
        break;
    case 'php':
        $fileExtension = '.php';
        $sourceFile = $tempDir . $uniqueId . $fileExtension;
        // For PHP, ensure the code includes <?php ... ?> tags or prepend them.
        $phpCode = $code;
        if (strpos(trim($code), '<?php') !== 0 && strpos(trim($code), '<?') !== 0) {
            $phpCode = "<?php\n" . $code . "\n?>";
        }
        file_put_contents($sourceFile, $phpCode);
        // Using -d display_errors=1 to catch errors that might not go to stderr otherwise.
        $command = 'php -d display_errors=1 ' . escapeshellarg($sourceFile) . ' 2>&1';
        break;
    default:
        $response['error'] = 'Unsupported language: ' . htmlspecialchars($language);
        echo json_encode($response);
        exit;
}

// Execute the command
if ($command) {
    // Timeout for execution (e.g., 10 seconds). Requires `timeout` command (Linux).
    // On Windows, this is more complex. For simplicity, not implemented here.
    // $command = 'timeout 10s ' . $command;

    $proc = proc_open($command, [
        0 => ['pipe', 'r'], // stdin
        1 => ['pipe', 'w'], // stdout
        2 => ['pipe', 'w']  // stderr (already redirected to stdout in $command strings)
    ], $pipes);

    if (is_resource($proc)) {
        fwrite($pipes[0], $stdin);
        fclose($pipes[0]);

        $output = stream_get_contents($pipes[1]);
        fclose($pipes[1]);

        // $stderr_output = stream_get_contents($pipes[2]); // If stderr wasn't redirected
        // fclose($pipes[2]);

        $exit_code = proc_close($proc);

        if ($exit_code === 0) {
            $response['output'] = $output;
        } else {
            // If there was output, it might contain error messages from the script itself
            // or from the interpreter/compiler if stderr was redirected.
            $response['error'] = "Execution failed (exit code: $exit_code).\n" . $output;
        }
    } else {
        $response['error'] = 'Failed to execute the command.';
    }
}


// Cleanup temporary files
$filesToClean = [$sourceFile];
if ($language === 'c' || $language === 'cpp') {
    if (file_exists($outputFile)) $filesToClean[] = $outputFile;
}
if ($language === 'java') {
    $classFilePath = $classFileDir . DIRECTORY_SEPARATOR . $className . '.class';
    if (file_exists($classFilePath)) $filesToClean[] = $classFilePath;
}
cleanup($filesToClean);


echo json_encode($response);

function cleanup(array $files) {
    foreach ($files as $file) {
        if (file_exists($file)) {
            unlink($file);
        }
    }
}

?>
