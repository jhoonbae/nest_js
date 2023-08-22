import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


// custom Decorator 함수
export function NotIn(property : string, valitionOptions : ValidationOptions) { // 데커레이터의 인수는 객체에서 참조하려하는 다른 속성의 이름과 ValidationOption을 받는다.
    return (object : Object, propertyName : string) => { // registerDecorator를 호출하는 함수를 리턴, 이 함수의 인수로 데커레이터가 선언될 객체와 속성 이름을 받는다.
        registerDecorator({
            name : 'NotIn', // 데커레이터 이름 지정.
            target : object.constructor, // 객체가 생성될 때 적용.
            propertyName,
            options : valitionOptions, // 유효성 옵션은 인수로 전달받은것을 사용
            constraints : [property], // 속성에 적용되도록 제약조건 설정
            validator : { // 유효성 검사 규칙이 validator 속성에 기술, ValidatorConstraint Interface를 구현한 함수
                validate(value : any, args : ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = (args.object as any)[relatedPropertyName]
                    return typeof value === 'string' && typeof relatedValue === 'string' && !relatedValue.includes(value)
                }
            }
        })
    }
}