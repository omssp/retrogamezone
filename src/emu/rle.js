(function () {
    var RLE = {};
    RLE.encode = (nums, options) => {
        const encoded = [];
        const max_run_length =
            options && options.max_run_length ? options.max_run_length : Infinity;
        const chunk = (options && options.chunk) || false;
        let current = nums[0];
        let run_length = 1;
        for (let i = 1; i < nums.length; i++) {
            const num = nums[i];
            if (num === current && run_length != max_run_length) {
                run_length++;
            } else {
                if (chunk) {
                    encoded.push([current, run_length]);
                } else {
                    encoded.push(run_length);
                    encoded.push(current);
                }
                current = num;
                run_length = 1;
            }
        }
        if (chunk) {
            encoded.push([current, run_length]);
        } else {
            encoded.push(run_length);
            encoded.push(current);
        }
        return encoded;
    }

    RLE.decode = nums => {
        const decoded = [];
        for (let i = 0; i < nums.length; i += 2) {
            const run_length = nums[i];
            const value = nums[i + 1];
            for (let ii = 0; ii < run_length; ii++) {
                decoded.push(value);
            }
        }
        return decoded;
    };

    if ('undefined' !== typeof module) {
        module.exports = RLE;
    } else {
        window.RLE = RLE;
    }
}());