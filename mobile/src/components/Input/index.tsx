import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';

import { useField } from '@unform/core';

import { Container, TextInput, Icon, ErrorMessage } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon?: string;
  containerStyle?: {};
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { registerField, defaultValue = '', error, fieldName } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    if (inputValueRef.current.value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, []);

  return (
    <>
      <Container
        isFocused={isFocused}
        isErrored={!!error}
        style={containerStyle}
      >
        <Icon
          name={icon}
          size={20}
          color={isFilled || isFocused ? '#FF9000' : '#666360'}
        />
        <TextInput
          {...rest}
          placeholderTextColor="#666360"
          keyboardAppearance="dark"
          onChangeText={value => {
            inputValueRef.current.value = value;
          }}
          defaultValue={defaultValue}
          ref={inputElementRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

export default forwardRef(Input);
