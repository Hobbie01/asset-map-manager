-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.owners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    tax_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    coordinates POINT,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.asset_owners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.owners(id) ON DELETE CASCADE,
    ownership_type TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    UNIQUE(asset_id, owner_id, ownership_type)
);

CREATE TABLE IF NOT EXISTS public.asset_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_asset_owners_asset_id ON public.asset_owners(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_owners_owner_id ON public.asset_owners(owner_id);
CREATE INDEX IF NOT EXISTS idx_asset_files_asset_id ON public.asset_files(asset_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_table_name ON public.activities(table_name);
CREATE INDEX IF NOT EXISTS idx_activities_record_id ON public.activities(record_id);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Owners policies
CREATE POLICY "Anyone can view owners"
    ON public.owners FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert owners"
    ON public.owners FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update owners"
    ON public.owners FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete owners"
    ON public.owners FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Assets policies
CREATE POLICY "Anyone can view assets"
    ON public.assets FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert assets"
    ON public.assets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update assets"
    ON public.assets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete assets"
    ON public.assets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Asset owners policies
CREATE POLICY "Anyone can view asset owners"
    ON public.asset_owners FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert asset owners"
    ON public.asset_owners FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update asset owners"
    ON public.asset_owners FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete asset owners"
    ON public.asset_owners FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Asset files policies
CREATE POLICY "Anyone can view asset files"
    ON public.asset_files FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert asset files"
    ON public.asset_files FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete asset files"
    ON public.asset_files FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Activities policies
CREATE POLICY "Anyone can view activities"
    ON public.activities FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert activities"
    ON public.activities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for all tables
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.owners
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.asset_owners
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 