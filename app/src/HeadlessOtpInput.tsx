import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
} from "react";

type RootProps = React.HTMLAttributes<HTMLDivElement>;
type ContextValue = {
  register: (id: string) => void;
  unregister: (id: string) => void;
  orderRegister: (el: HTMLInputElement) => void;
  onFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: Record<string, string>;
};

const OtpInputContext = createContext<ContextValue>({
  register: () => {},
  unregister: () => {},
  orderRegister: () => {},
  onFieldChange: () => {},
  values: {},
});

function Root(props: RootProps) {
  const elements: HTMLInputElement[] = [];

  const [values, setValues] = useState<Record<string, string>>({});

  const register = useCallback((id: string) => {
    setValues((prev) => ({ ...prev, [id]: "" }));
  }, []);

  const unregister = useCallback((id: string) => {
    setValues((prev) => {
      const curr = { ...prev };
      delete curr[id];
      return curr;
    });
  }, []);

  const orderRegister = (el: HTMLInputElement) => {
    if (!elements.includes(el)) {
      elements.push(el);
    }
  };

  const getNextElement = (currentElement: HTMLInputElement) => {
    const index = elements.indexOf(currentElement);
    return elements[index + 1];
  };

  const deleteValue = (element: HTMLInputElement) => {
    setValues((prev) => {
      const curr = { ...prev };
      const valueArray = elements
        .map((el) => (el === element ? "" : curr[el.id]))
        .filter((value) => value);
      elements.forEach((el, index) => {
        curr[el.id] = valueArray[index] || "";
      });

      return curr;
    });
  };

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    if (!value) {
      deleteValue(event.target);
      return;
    }

    setValues((prev) => ({ ...prev, [id]: value }));

    if (value) {
      const nextElement = getNextElement(event.target);
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  return (
    <OtpInputContext.Provider
      value={{ register, unregister, orderRegister, onFieldChange, values }}
    >
      <div {...props}>{props.children}</div>
    </OtpInputContext.Provider>
  );
}

function Field() {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const { register, unregister, orderRegister, onFieldChange, values } =
    useContext(OtpInputContext);

  useEffect(() => {
    if (ref.current) orderRegister(ref.current);
  }, [orderRegister]);

  useEffect(() => {
    register(id);
    return () => unregister(id);
  }, [id, register, unregister]);

  return (
    <input
      id={id}
      ref={ref}
      value={values[id] || ""}
      onChange={onFieldChange}
    />
  );
}

export { Root, Field };
