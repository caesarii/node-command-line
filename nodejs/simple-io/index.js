
function __main() {

  const stdin = process.stdin
  const stdout = process.stdout

  stdin.on('data', data => {
    params = data.toString()
    stdout.write(`${Date.now()}: ${params}`)
  })
}



__main()