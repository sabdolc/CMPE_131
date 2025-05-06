const { spawn } = require('child_process');
const pythonProcess = spawn('python', ['-c', 'import sys; print(sys.executable)']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python executable: ${data.toString().trim()}`);
});