abstract class User implements UserInterface {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    abstract findByName(name: string, age: number): User;
    abstract findByName(name: string, age: number): User;
    display(): void {
        console.log(this.name);
    }

}