# xunit-junit

Split a single xunit thing into multiple junit files.
This can be used in combination with
[tap-xunit](http://npm.im/tap-xunit) to generate reports for systems
that can only understan single junit files.

## Install

```
npm i xunit-junit -g
```

## Usage

```
cat results.xunit | xunit-junit test-results
```

## Programmatic Usage

See test.js

## Acknowledgements

The development of this library was sponsored by [nearForm](http://nearform.com)

## License

MIT
