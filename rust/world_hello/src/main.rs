fn variable() {
    let mut x = 5;
    println!("x={}", x);
    x = 6;
    println!("x={}", x);
}


fn five() -> i32 {
    return 5;
}


fn add(x: i32, y:i32) -> i32 {
    return x + y;
}

fn main() {
    println!("Hello, world!");

    // variable()
    
    // let n = five();
    // println!("{}", n)

    let sum = add(1, 1);
    println!("sum = {}", sum);
}
