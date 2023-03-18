export const ServerSideProps = (props) => {
    const { children, ...rest } = props;
    return {
        props: rest,
        children,
    };
};
