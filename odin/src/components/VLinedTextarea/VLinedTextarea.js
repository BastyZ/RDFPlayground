export default {
  name: "VLinedTextarea",
  mounted() {
    this.content = this.value;
    this.syncScroll();
    this.calculateCharactersPerLine();
  },
  data() {
    return {
      content: "",
      widthPerChar: 8, // Hard coded, adjust when necessary
      numPerLine: 1,
      previousWidth: 0,
      scrolledLength: 0,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    disabled_input: {
      type: Boolean,
      default: false,
    },
    nowrap: {
      type: Boolean,
      default: false,
    },
    counter: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    no_resize: {
      type: Boolean,
      default: false,
    },
    autogrow: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: String,
      default: "1",
    },
    label: {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    styles: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: String,
      default: "",
    },
    validate: {
      type: Function,
      default: () => true,
    },
  },
  computed: {
    invalidLines() {
      const lineNumbers = [];
      this.content.split("\n").forEach((line, index) => {
        if (!this.validate(line)) {
          lineNumbers.push(index + 1);
        }
      });
      return lineNumbers;
    },
    lines() {
      if (this.content === "") return [1];
      const lineNumbers = [];
      let num = 1;

      // Number of lines extended. Seems to work with pre-wrap (has problem with dash)
      function getWrapTimes(sentence, width) {
        if (width <= 0) {
          // Protect against infinite loop
          console.warn(
            "Please set the min-width of textarea to allow at least one character per line."
          );
          return sentence.length + 1; // Seems browser would add one additional space
        }
        const words = sentence.split(" ");
        let currentLine = 1;
        let spaceLeft = width;
        words.forEach((word) => {
          while (spaceLeft === width && word.length >= spaceLeft) {
            currentLine++;
            word = word.slice(width);
          }
          if (spaceLeft === width) {
            spaceLeft -= word.length;
            return;
          }
          if (word.length + 1 > spaceLeft) {
            currentLine++;
            spaceLeft = width;
          }
          spaceLeft -= spaceLeft === width ? word.length : word.length + 1;
        });
        return spaceLeft === width ? currentLine - 1 : currentLine;
      }

      this.content.split("\n").forEach((line) => {
        const wrapTimes = getWrapTimes(line, this.numPerLine) - 1;
        lineNumbers.push(num);
        for (let i = 0; i < wrapTimes; i++) {
          lineNumbers.push("&nbsp;");
        }
        num++;
      });
      return lineNumbers;
    },
    longestWidth() {
      let last_i = this.lines.length - 1;
      for (let i = this.lines.length - 1; i >= 0; i--) {
        if (this.lines[i] === "&nbsp;") continue;
        break;
      }
      return (this.lines[last_i] + "").length * this.widthPerChar + 10; // 10px base padding-right
    },
  },
  watch: {
    // When left area grows/shrinks e.g. 9 => 10; 100 => 99
    longestWidth(val, oldVal) {
      if (val !== oldVal) {
        this.$nextTick(() => this.calculateCharactersPerLine());
      }
    },
    nowrap() {
      this.calculateCharactersPerLine();
    },
    value(val) {
      if (val !== this.content) {
        this.content = val;
      }
    },
  },
  methods: {
    calculateCharactersPerLine() {
      // May be +-1 off real value >_<
      if (this.nowrap) {
        this.numPerLine = Number.MAX_SAFE_INTEGER;
        return;
      }
      const textarea = this.$refs["aTextarea"].$refs.input;
      const styles = getComputedStyle(textarea);
      const paddingLeft = parseFloat(styles.getPropertyValue("padding-left"));
      const paddingRight = parseFloat(styles.getPropertyValue("padding-right"));
      const fontSize = styles.getPropertyValue("font-size");
      const fontFamily = styles.getPropertyValue("font-family");
      const width = textarea.clientWidth - paddingLeft - paddingRight;
      const helper = this.$refs.helper;
      helper.style.fontSize = fontSize;
      helper.style.fontFamily = fontFamily;
      helper.innerHTML = "";
      for (let num = 1; num < 999; num++) {
        helper.innerHTML += "a";
        if (helper.getBoundingClientRect().width > width) {
          this.numPerLine = num - 1;
          break;
        }
      }
    },
    detectResize() {
      const textarea = this.$refs["aTextarea"].$refs.input;
      const { clientWidth: w1, clientHeight: h1 } = textarea;
      const detect = () => {
        const { clientWidth: w2, clientHeight: h2 } = textarea;
        if (w1 !== w2 || h1 !== h2) {
          this.calculateCharactersPerLine();
        }
      };
      const stop = () => {
        this.calculateCharactersPerLine();
        document.removeEventListener("mousemove", detect);
        document.removeEventListener("mouseup", stop);
      };
      document.addEventListener("mousemove", detect);
      document.addEventListener("mouseup", stop);
    },
    onInput() {
      this.$emit("input", this.content);
      this.recalculate();
    },
    recalculate() {
      const textarea = this.$refs["aTextarea"].$refs.input;
      const width = textarea.clientWidth;
      if (width !== this.previousWidth) {
        this.calculateCharactersPerLine();
      }
      this.previousWidth = width;
    },
    scrollLines(e) {
      this.scrolledLength = e.target.scrollTop;
      this.syncScroll();
    },
    syncScroll() {
      this.$refs.lines.style.transform = `translateY(${-this
        .scrolledLength}px)`;
    },
  },
};