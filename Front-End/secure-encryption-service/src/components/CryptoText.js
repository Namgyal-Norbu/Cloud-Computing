import React , {useState} from 'react';

const CryptoTest = ({onEncrypt}) => {

    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onEncrypt(text);
        } else {
            alert ('Please enter some text to encrypt');
        }
    };

    return (
        <section>
            <h2>Crypto Text Encrypt Test</h2>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="enter text"
                required
            />
            <button type="submit">Encrypt</button>
            </form>
        </section>
    )
}

export default CryptoTest;