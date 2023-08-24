import { ConsoleLogger } from "@nestjs/common";


export class MyLogger extends ConsoleLogger{
    error(message: any, stack?: string, context?: string){
        super.error.apply(this, arguments)
        this.doSomthing()
    };

    private doSomthing() {
        // 로깅의 부가 로직 추가 예) DB저장 등 ...
    }
}