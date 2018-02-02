## my adventures through FSharp Language

it's been i while that I'm developping C# applications, and really like the language's flexablity, and also tooling and documentations, and in the majority of my projects I still use it, but recently I decided to have an experience using F#, i know about the language about 5 years ago, it was a project in the microsoft research website, the first contact was a superficial one, with just a curiosity to know the language and its syntax, but this time the experience was different because the fact that a lots of functionality i need to implement in a dynamic apis engine requires more flexibility, and all i need was in the F# world, the first interesting thing and may be the origin of my passion about this language was to concept (Discriminated Unions & Matching Pattern) just those two functionalities was realy impressioning, just not possible in C#, and for some solutions that require a lot of abstractions and patterns etc... just the usage of these two concepts turn the solution into a few lines of code.

just lets go for it;

### to FSharp or not To FSharp

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Discriminated Unions declaration:
    type StringOrInt = 
      | String of text:String
      | Integer of count:Integer
      
The Option discriminated union case:
    type Option<'T> = 
      | Some of 'T
      | None

    let printResult<'T> value:Option<'T> = 
          match value with 
          | Some t -> printfn "%o" t
          | None -> printfn "no data"

and here is a very ispiring example from msdn.microsoft.com

    type Expression =
        | Number of int
        | Add of Expression * Expression
        | Multiply of Expression * Expression
        | Variable of string

    let rec Evaluate (env:Map<string,int>) exp =
        match exp with
        | Number n -> n
        | Add (x, y) -> Evaluate env x + Evaluate env y
        | Multiply (x, y) -> Evaluate env x * Evaluate env y
        | Variable id    -> env.[id]

    let environment = Map.ofList [ "a", 1 ;
                                   "b", 2 ;
                                   "c", 3 ]

    // Create an expression tree that represents
    // the expression: a + 2 * b.
    let expressionTree1 = Add(Variable "a", Multiply(Number 2, Variable "b"))

    // Evaluate the expression a + 2 * b, given the
    // table of values for the variables.
    let result = Evaluate environment expressionTree1

### AspNetCore Mvc Application using F#.
the repository FSharpWebApp-With-EfCore is an example of using FSharp in an AspNetcore web application, including the usage of EntityFrameworkCore and identity, its purpose is to be starting point to understand Oriented Object Programming paradigm usage on F#,
andd then contains a lot of statements, instructions and declarations of objects interfaces abstractions etc..., and then from here we will migrate to a more functional way of developing web applications, such as the integration of Suave or Giraffe and others ....
[introduction](introduction)
#### objects types definition:
     

### Material template
[material]

