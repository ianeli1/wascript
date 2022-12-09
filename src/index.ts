import fs from "fs"
import path from "path"
import readline from "readline"

const outputPath = path.join(__dirname, "../wabuild/")
const inputPath = path.join(__dirname, "../wasrc")

async function main(){
    const files = fs.readdirSync(inputPath)

    for(const fileName of files){
        const filePath = path.join(inputPath, fileName)
        fs.mkdirSync(outputPath, {recursive: true })
        const fileStream = fs.createReadStream(filePath)
        const newFilePath = path.join(outputPath, fileName.replace('wa', 'js'))
        const newFile = fs.createWriteStream(newFilePath, {
            flags: 'a+' // 'a' means appending (old data will be preserved)
          })
        const iface = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })

        iface.on("line", line => {
            newFile.write(line.replaceAll("wa", ""))
        })

        await new Promise<void>((res) => {
            iface.on("close", () => {
                newFile.close()
                res()
            })
        })

        console.log(`${fileName} => ${fileName.replace(".wa", ".js")}`)
    }
}

main()