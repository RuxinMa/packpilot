interface RegisterFormProps {
  onSubmit: (
    username: string, 
    password: string, 
    confirmPassword: string, 
    role: 'manager' | 'worker'
  ) => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error }) => {

  const handleSubmit = () => {};

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      
      {/* Todo: register form cotent */}

    </form>
  );
};

export default RegisterForm;